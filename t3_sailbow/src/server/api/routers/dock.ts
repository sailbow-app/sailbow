import { captainMiddleware, createTRPCRouter, protectedBoatProcedure, protectedProcedure } from "@/server/api/trpc";
import { type InferInsertModel, and, eq, isNull, or } from "drizzle-orm";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { boats, crewMembers } from "@/server/db/schema";
import { clerkClient } from "@clerk/nextjs";
import { getUrl } from "@/trpc/shared";
import { createBoatSchema } from "@/lib/schemas/boat";

type InsertBoat = InferInsertModel<typeof boats>
type InsertCrewMember = InferInsertModel<typeof crewMembers>

export const dockRouter = createTRPCRouter({
  createBoat: protectedProcedure
    .input(createBoatSchema)
    .mutation(async ({ input, ctx }) => {
      throw new Error();
      const insertBoat: InsertBoat = {
        ...input,
        captainUserId: ctx.auth.userId
      };
      const result = await db.transaction(async (tx) => {
        const insertBoatResult = (await tx.insert(boats).values(insertBoat).returning())[0];

        if (!insertBoatResult) throw new Error('Failed to insert boat');

        const boatId = insertBoatResult.id;
        const crew: InsertCrewMember[] = input.crewInvites.map(ci => {
          return {
            boatId,
            email: ci.emailAddress,
            role: ci.role,
            userId: null
          }
        })
        crew.push({ boatId, userId: ctx.auth.userId, role: "captain", email: ctx.auth.primaryEmail })
        await tx.insert(crewMembers).values(crew)
        return { boatId }
      })
      
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: input.crewInvites.map(ci => ci.emailAddress)
      });

      const existingPrimaryEmails = existingUsers
        .map(u => u.emailAddresses.find(e => e.id === u.primaryEmailAddressId))
        .map(e => e?.emailAddress);

      const invites = input.crewInvites
        .filter(ci => !existingPrimaryEmails.includes(ci.emailAddress))
        .map(ci => {
          return {
            ...ci,
            redirectUrl: `${getUrl()}/sign-in?redirectUrl=/dock/${result.boatId}`,
            publicMetadata: {
              inviterName: ctx.auth.user?.firstName,
              boatName: input.name
            }
          }
        });

      await Promise.all(invites.map(i => clerkClient.invitations.createInvitation(i)));
      return result;
    }),

  getBoats: protectedProcedure
    .query(async ({ ctx }) => {
      const memberships = await ctx.db.query.crewMembers.findMany({
        where: or(
          eq(crewMembers.userId, ctx.auth.userId),
          eq(crewMembers.email, ctx.auth.primaryEmail)
        ),
        with: {
          boat: true,
        },
      })
      return memberships.map((m) => m.boat) ?? []
    }),
  
  getBoatById: protectedProcedure
    .input(z.object({
        boatId: z.coerce.number().min(1),
    }))
    .query(async ({ input, ctx }) => {
      const membership = await ctx.db.query.crewMembers.findFirst({
        where: and(
          eq(crewMembers.boatId, input.boatId),
          or(
            eq(crewMembers.userId, ctx.auth.userId),
            eq(crewMembers.email, ctx.auth.primaryEmail)
          )
        ),
        with: {
          boat: {
            with: {
              crew: true
            }
          }
        }
      })
      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND"
        })
      }

      return membership.boat
    }),

  deleteBoatById: protectedBoatProcedure
    .use(captainMiddleware)
    .input(z.object({
      boatId: z.number().min(1)
    }))
    .mutation(async ({ ctx }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.delete(boats).where(eq(boats.id, ctx.boat.id))
        await tx.delete(crewMembers).where(eq(crewMembers.boatId, ctx.boat.id))
      })
      revalidatePath("/dock", "page")
    })
})
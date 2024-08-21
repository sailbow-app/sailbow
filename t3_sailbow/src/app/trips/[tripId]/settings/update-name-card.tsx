"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
} from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { useConvexMutation } from "@/lib/convex-client-helpers";
import { useTrip } from "@/lib/trip-queries";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateNameSchema = z.object({
  tripId: z.custom<Id<"trips">>(),
  name: z.string(),
});

export default function UpdateNameCard() {
  const { data: trip } = useTrip();

  const form = useForm<z.infer<typeof updateNameSchema>>({
    resolver: zodResolver(updateNameSchema),
  });

  useEffect(() => {
    if (!!trip && !form.control.getFieldState("name").isTouched) {
      form.setValue("tripId", trip._id);
      form.setValue("name", trip.name);
    }
  }, [trip, form]);

  const { isLoading, mutate } = useConvexMutation(
    api.trips.mutations.updateName,
    {
      onSuccess: () => {
        toast.success("Successfully updated the trip name!");
      },
      onError: (err) => {
        const msg = err instanceof ConvexError ? err.message : undefined;

        toast.error("Something went wrong there, please try again later", {
          description: msg,
        });
      },
    },
  );

  const onSubmit = async (values: z.infer<typeof updateNameSchema>) => {
    await mutate(values);
  };

  return (
    <Form {...form}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Name</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormInput {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}

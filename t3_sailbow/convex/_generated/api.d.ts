/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.13.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as _lib_clerk from "../_lib/clerk.js";
import type * as _lib_queryUtils from "../_lib/queryUtils.js";
import type * as announcements_mutations from "../announcements/mutations.js";
import type * as announcements_queries from "../announcements/queries.js";
import type * as authUtils from "../authUtils.js";
import type * as errorUtils from "../errorUtils.js";
import type * as http from "../http.js";
import type * as images_actions from "../images/actions.js";
import type * as invitations_actions from "../invitations/actions.js";
import type * as invitations_mutations from "../invitations/mutations.js";
import type * as invitations_queries from "../invitations/queries.js";
import type * as tripUtils from "../tripUtils.js";
import type * as trips_mutations from "../trips/mutations.js";
import type * as trips_queries from "../trips/queries.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "_lib/clerk": typeof _lib_clerk;
  "_lib/queryUtils": typeof _lib_queryUtils;
  "announcements/mutations": typeof announcements_mutations;
  "announcements/queries": typeof announcements_queries;
  authUtils: typeof authUtils;
  errorUtils: typeof errorUtils;
  http: typeof http;
  "images/actions": typeof images_actions;
  "invitations/actions": typeof invitations_actions;
  "invitations/mutations": typeof invitations_mutations;
  "invitations/queries": typeof invitations_queries;
  tripUtils: typeof tripUtils;
  "trips/mutations": typeof trips_mutations;
  "trips/queries": typeof trips_queries;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

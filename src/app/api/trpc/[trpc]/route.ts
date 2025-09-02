import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
/**
 * tRPC "handler" for Next.js API routes.
 *
 * Even though calling tRPC procedures from the client feels like calling plain
 * TypeScript functions, under the hood it’s still just HTTP requests. Here’s
 * the flow:
 *
 * 1. On the client, when you call e.g. `trpc.user.getById.query({ id: "123" })`,
 *    tRPC encodes this into a POST request to `/api/trpc/user.getById` with the
 *    input JSON in the body.
 *
 * 2. That HTTP request hits this handler (exported as GET/POST in Next.js).
 *
 * 3. `fetchRequestHandler` takes the request, extracts the procedure name
 *    ("user.getById"), looks it up in the `appRouter`, validates the input, and
 *    then calls the correct resolver function on the server with the request
 *    context.
 *
 * 4. The resolver’s return value is serialized back into JSON and sent to the
 *    client. The tRPC client then deserializes it so it looks like the function
 *    call just “returned” data.
 *
 * In short: this file is the bridge that makes tRPC feel like direct function
 * calls while still running over standard HTTP under the hood.
 */
/**
 * This file is the single HTTP entrypoint for all tRPC calls in the app.
 *
 * - The `[trpc]` in the file path is a Next.js "dynamic route" segment.
 *   When the client calls something like `trpc.user.getById.query({ id: "123" })`,
 *   it actually sends a POST request to `/api/trpc/user.getById`.
 *   Next.js replaces `[trpc]` with the string `"user.getById"` in `params`.
 *
 * - `fetchRequestHandler` takes the incoming request, extracts that procedure
 *   name (`"user.getById"`), looks it up inside the merged `appRouter`, validates
 *   the JSON input, and then runs the correct server-side resolver.
 *
 * - Even though it feels like "just calling a TypeScript function" on the client,
 *   it's still standard HTTP + JSON under the hood. The tRPC client automatically
 *   handles JSON.stringify on the way out and JSON.parse on the way back.
 *
 * - You only ever need this single `[trpc]` route file. For organization, you can
 *   split your routers into files like `userRouter`, `postRouter`, etc., then merge
 *   them into one `appRouter`. All procedures are then accessible through this one
 *   endpoint.
 */

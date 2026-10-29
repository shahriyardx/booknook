import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";

// Reads "Authorization: Bearer <jwt>" and verifies it against BetterAuth's JWKS.
export async function createContext({ req }: { req: Request }) {
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) return { user: null };
  const { payload } = await auth.api
    .verifyJWT({ body: { token } })
    .catch(() => ({ payload: null }));
  return { user: payload as { email: string; name: string } | null };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/** Requires a valid JWT; narrows `ctx.user` to non-null. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please log in first",
    });
  return next({ ctx: { user: ctx.user } });
});

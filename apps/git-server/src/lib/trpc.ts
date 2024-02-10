import { TRPCError, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

// created for each request
export async function createContext({ req, res, }: trpcExpress.CreateExpressContextOptions) {
    // No context yet
    return {}
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

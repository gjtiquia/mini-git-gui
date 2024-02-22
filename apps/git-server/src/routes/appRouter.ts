import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, router } from "../lib/trpc";
import { getAllCommitsProcedure } from './getAllCommitsProcedure';

const trpcAppRouter = router({
    getAllCommits: getAllCommitsProcedure()
});

// export type definition of API
export type AppRouter = typeof trpcAppRouter;

export const appRouter = trpcExpress.createExpressMiddleware({
    router: trpcAppRouter,
    createContext,
})

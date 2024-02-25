import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, router } from "../lib/trpc";
import { getAllCommitsProcedure } from './getAllCommitsProcedure';
import { getStatusProcedure } from './getStatusProcedure';
import { stageFilesProcedure } from './stageFilesProcedure';

const trpcAppRouter = router({
    getAllCommits: getAllCommitsProcedure(),
    getStatus: getStatusProcedure(),
    stageFiles: stageFilesProcedure(),
});

// export type definition of API
export type AppRouter = typeof trpcAppRouter;

export const appRouter = trpcExpress.createExpressMiddleware({
    router: trpcAppRouter,
    createContext,
})

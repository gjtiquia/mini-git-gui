import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, router } from "../lib/trpc";
import { getAllCommitsProcedure } from './getAllCommitsProcedure';
import { getStatusProcedure } from './getStatusProcedure';
import { stageFilesProcedure } from './stageFilesProcedure';
import { unstageFilesProcedure } from './unstageFilesProcedure';

const trpcAppRouter = router({
    // Commits View
    getAllCommits: getAllCommitsProcedure(),

    // LocalChanges View
    getStatus: getStatusProcedure(),

    // UnstagedChanges View
    stageFiles: stageFilesProcedure(),

    // StagedChanges View
    unstageFiles: unstageFilesProcedure(),
});

// export type definition of API
export type AppRouter = typeof trpcAppRouter;

export const appRouter = trpcExpress.createExpressMiddleware({
    router: trpcAppRouter,
    createContext,
})

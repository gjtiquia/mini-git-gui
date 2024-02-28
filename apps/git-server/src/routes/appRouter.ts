import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, publicProcedure, router } from "../lib/trpc";
import { getAllCommitsProcedure } from './getAllCommitsProcedure';
import { getStatusProcedure } from './getStatusProcedure';
import { stageFilesProcedure } from './stageFilesProcedure';
import { unstageFilesProcedure } from './unstageFilesProcedure';
import { discardFilesProcedure } from './discardFilesProcedure';
import { commitFilesProcedure } from './commitFilesProcedure';
import { rootDirectory } from '../store';
import { gitPushAsync } from '../features/gitPush';
import { gitPullAsync } from '../features/gitPull';
import { gitFetchAsync } from '../features/gitFetch';

const trpcAppRouter = router({
    // Push, Pull, Fetch
    push: publicProcedure.mutation(async () => await gitPushAsync(rootDirectory)),
    pull: publicProcedure.mutation(async () => await gitPullAsync(rootDirectory)),
    fetch: publicProcedure.mutation(async () => await gitFetchAsync(rootDirectory)),

    // Commits View
    getAllCommits: getAllCommitsProcedure(),

    // LocalChanges View
    getStatus: getStatusProcedure(),

    // UnstagedChanges View
    discardFiles: discardFilesProcedure(),
    stageFiles: stageFilesProcedure(),

    // StagedChanges View
    unstageFiles: unstageFilesProcedure(),
    commitFiles: commitFilesProcedure(),
});

// export type definition of API
export type AppRouter = typeof trpcAppRouter;

export const appRouter = trpcExpress.createExpressMiddleware({
    router: trpcAppRouter,
    createContext,
})

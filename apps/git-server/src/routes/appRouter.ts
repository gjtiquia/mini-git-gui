import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, publicProcedure, router } from "../lib/trpc";
import { getAllCommitsProcedure } from './getAllCommitsProcedure';
import { getStatusProcedure } from './getStatusProcedure';
import { stageFilesProcedure } from './stageFilesProcedure';
import { unstageFilesProcedure } from './unstageFilesProcedure';
import { discardFilesProcedure } from './discardFilesProcedure';
import { commitFilesProcedure } from './commitFilesProcedure';
import { getRootDirectory } from '../store';
import { gitPushAsync } from '../features/gitPush';
import { gitPullAsync } from '../features/gitPull';
import { gitFetchAsync } from '../features/gitFetch';
import { getUnstagedFileChangesProcedure } from './getUnstagedFileChangesProcedure';
import { getStagedFileChangesProcedure } from './getStagedFileChangesProcedure';

const trpcAppRouter = router({
    // Push, Pull, Fetch
    push: publicProcedure.mutation(async () => await gitPushAsync(getRootDirectory())),
    pull: publicProcedure.mutation(async () => await gitPullAsync(getRootDirectory())),
    fetch: publicProcedure.mutation(async () => await gitFetchAsync(getRootDirectory())),

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

    // DiffStack
    getUnstagedFileChanges: getUnstagedFileChangesProcedure(),
    getStagedFileChanges: getStagedFileChangesProcedure(),
});

// export type definition of API
export type AppRouter = typeof trpcAppRouter;

export const appRouter = trpcExpress.createExpressMiddleware({
    router: trpcAppRouter,
    createContext,
})

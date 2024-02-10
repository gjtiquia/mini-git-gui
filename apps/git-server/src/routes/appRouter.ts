import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, publicProcedure, router } from "../lib/trpc";
import { getAllCommitsAsync } from '../getAllCommitsAsync';

const trpcAppRouter = router({
    getAllCommits: publicProcedure
        .query(async () => {
            // const rootDirectory = "/Users/gjtiquia/Documents/Projects/SelfProjects/mini-text-editor";
            const rootDirectory = "/Users/EuniceChen/Downloads/_GJDocuments/mini-git-gui"
            const commits = await getAllCommitsAsync(rootDirectory);

            console.log(commits);
            console.log("total:", commits.length);

            return commits;
        })
});

// export type definition of API
export type AppRouter = typeof trpcAppRouter;

export const appRouter = trpcExpress.createExpressMiddleware({
    router: trpcAppRouter,
    createContext,
})
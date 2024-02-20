import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, publicProcedure, router } from "../lib/trpc";
import { getAllCommitsAsync } from '../getAllCommitsAsync';

const trpcAppRouter = router({
    getAllCommits: publicProcedure
        .query(async () => {

            const rootDirectory = "../../../mini-git-gui"
            // const rootDirectory = "../../../mini-text-editor"

            const commits = await getAllCommitsAsync(rootDirectory);

            // console.log(Date.now() + " getAllCommits")
            // console.log(commits.slice(0, 5));
            return commits;
        })
});

// export type definition of API
export type AppRouter = typeof trpcAppRouter;

export const appRouter = trpcExpress.createExpressMiddleware({
    router: trpcAppRouter,
    createContext,
})
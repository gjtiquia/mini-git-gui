import { publicProcedure } from "../lib/trpc";
import { getAllCommitsAsync } from '../features/getAllCommits';
import { rootDirectory } from "../store";

export function getAllCommitsProcedure() {
    return publicProcedure
        .query(async () => {
            const commits = await getAllCommitsAsync(rootDirectory);

            // console.log(Date.now() + " getAllCommits")
            // console.log(commits.slice(0, 5));
            return commits;
        });
}

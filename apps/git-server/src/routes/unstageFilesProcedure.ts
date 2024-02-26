import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { rootDirectory } from "../store";
import { unstageFilesAsync } from "../features/unstageFiles";

export function unstageFilesProcedure() {
    return publicProcedure
        .input(z.object({
            filePaths: z.array(z.string())
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            await unstageFilesAsync(rootDirectory, input.filePaths);
        });
}

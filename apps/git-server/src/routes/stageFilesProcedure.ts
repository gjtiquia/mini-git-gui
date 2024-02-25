import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { rootDirectory } from "../store";
import { stageFilesAsync } from "../features/stageFiles";

export function stageFilesProcedure() {
    return publicProcedure
        .input(z.object({
            filePaths: z.array(z.string())
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            await stageFilesAsync(rootDirectory, input.filePaths);
        });
}

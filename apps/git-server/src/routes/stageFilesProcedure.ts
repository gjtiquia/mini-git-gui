import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { getRootDirectory } from "../store";
import { stageFilesAsync } from "../features/stageFiles";
import { fileSchema } from "../features/types";

export function stageFilesProcedure() {
    return publicProcedure
        .input(z.object({
            files: z.array(fileSchema)
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            await stageFilesAsync(getRootDirectory(), input.files);
        });
}

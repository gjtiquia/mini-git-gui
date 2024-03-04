import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { getRootDirectory } from "../store";
import { unstageFilesAsync } from "../features/unstageFiles";
import { fileSchema } from "../features/types";

export function unstageFilesProcedure() {
    return publicProcedure
        .input(z.object({
            files: z.array(fileSchema)
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            await unstageFilesAsync(getRootDirectory(), input.files);
        });
}

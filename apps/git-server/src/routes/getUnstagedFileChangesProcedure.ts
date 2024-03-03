import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { rootDirectory } from "../store";
import { fileSchema } from "../features/types";
import { gitDiffUnstagedFileAsync } from "../features/gitDiffUnstagedFile";

export function getUnstagedFileChangesProcedure() {
    return publicProcedure
        .input(z.object({
            file: fileSchema
        }))
        .query(async (opts) => {
            const { input } = opts;
            return await gitDiffUnstagedFileAsync(rootDirectory, input.file);
        });
}

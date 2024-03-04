import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { getRootDirectory } from "../store";
import { fileSchema } from "../features/types";
import { gitDiffStagedFileAsync } from "../features/gitDiffStagedFile";

export function getStagedFileChangesProcedure() {
    return publicProcedure
        .input(z.object({
            file: fileSchema
        }))
        .query(async (opts) => {
            const { input } = opts;
            return await gitDiffStagedFileAsync(getRootDirectory(), input.file);
        });
}

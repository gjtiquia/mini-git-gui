import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { rootDirectory } from "../store";
import { fileSchema } from "../features/types";
import { discardFilesAsync } from "../features/discardFiles";

export function discardFilesProcedure() {
    return publicProcedure
        .input(z.object({
            files: z.array(fileSchema)
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            await discardFilesAsync(rootDirectory, input.files);
        });
}

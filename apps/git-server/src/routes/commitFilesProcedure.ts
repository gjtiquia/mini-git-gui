import z from "zod";
import { publicProcedure } from "../lib/trpc";
import { getRootDirectory } from "../store";
import { commitFilesAsync } from "../features/commitFiles";

export function commitFilesProcedure() {
    return publicProcedure
        .input(z.object({
            message: z.string(),
            description: z.optional(z.string())
        }))
        .mutation(async (opts) => {
            const { input } = opts;

            // console.log("commitFilesProcedure input", input);
            await commitFilesAsync(getRootDirectory(), input.message, input.description);
        });
}

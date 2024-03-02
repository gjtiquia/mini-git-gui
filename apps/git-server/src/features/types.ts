import z from "zod";

// TypeScript to Zod transformer
// https://transform.tools/typescript-to-zod

export type FileStatusCode = z.infer<typeof fileStatusCodeSchema>;
export const fileStatusCodeSchema = z.enum([
    " ",
    "M",
    "T",
    "A",
    "D",
    "R",
    "C",
    "U",
    "?",
    "!"
])

export type FileStatus = z.infer<typeof fileStatusSchema>;
export const fileStatusSchema = z.enum([
    "unmodified",
    "modified",
    "file-type-changed",
    "added",
    "deleted",
    "renamed",
    "copied",
    "updated-but-unmerged",
    "untracked",
    "ignored"
])

export const codeStatusMap: Record<FileStatusCode, FileStatus> = {
    " ": "unmodified",
    "M": "modified",
    "T": "file-type-changed",
    "A": "added",
    "D": "deleted",
    "R": "renamed",
    "C": "copied",
    "U": "updated-but-unmerged",
    "?": "untracked",
    "!": "ignored"
};

export type File = z.infer<typeof fileSchema>
export const fileSchema = z.object({
    status: fileStatusSchema,
    statusCode: fileStatusCodeSchema,
    formattedPath: z.string(),
    originalPath: z.string(),
    path: z.string(),
    name: z.string(),
})

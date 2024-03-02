import type { File } from "./types";

// Use these weird delimiters instead of just newline characters in-case of edge cases where those characters exist in the output
export const delimiter = ">>>MINI-GIT-GUI-DELIMITER<<<";
export const endline = ">>>MINI-GIT-GUI-ENDLINE<<<";

export function getUniquePathsAndOriginalPaths(files: File[]) {
    const filePaths = files.map(x => x.path);
    files.forEach(x => {
        if (!filePaths.includes(x.originalPath))
            filePaths.push(x.originalPath)
    })

    return filePaths;
}
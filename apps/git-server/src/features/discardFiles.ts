import { discardUntrackedFiles } from "./discardUntrackedFiles";
import { discardTrackedFiles } from "./discardTrackedFiles";
import { File } from "./types";

// Discard has different commands for tracked (existing) and untracked (new) files

export async function discardFilesAsync(rootDirectory: string, files: File[]) {

    const untrackedFilePaths = files
        .filter(x => x.status === "untracked")
        .map(x => x.path)

    const trackedFilePaths = files
        .filter(x => x.status !== "untracked")
        .map(x => x.path)

    await discardUntrackedFiles(rootDirectory, untrackedFilePaths);
    await discardTrackedFiles(rootDirectory, trackedFilePaths);
}
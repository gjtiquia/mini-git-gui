import { discardUntrackedFilesAsync } from "./discardUntrackedFiles";
import { discardTrackedFilesAsync } from "./discardTrackedFiles";
import { File } from "./types";

// Discard has different commands for tracked (existing) and untracked (new) files

export async function discardFilesAsync(rootDirectory: string, files: File[]) {

    const untrackedFilePaths = files
        .filter(x => x.status === "untracked")

    const trackedFilePaths = files
        .filter(x => x.status !== "untracked")

    await discardUntrackedFilesAsync(rootDirectory, untrackedFilePaths);
    await discardTrackedFilesAsync(rootDirectory, trackedFilePaths);
}
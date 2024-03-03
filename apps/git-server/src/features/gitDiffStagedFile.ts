import { spawn } from "child_process";
import type { File, FileDiff, LineDiff } from "./types";
import { parseLineDiffs } from "./gitDiffUtils";

/*
# Staged files

## Staged tracked files
$ git diff --staged --word-diff=porcelain <file-name>

## Staged untracked files
$ git diff --staged --word-diff=porcelain <file-name>
- Works!
*/

export function gitDiffStagedFileAsync(rootDirectory: string, file: File): Promise<FileDiff> {
    return new Promise((resolve, reject) => {

        let error = "";
        const lineDiffs: LineDiff[] = [];

        const filePath = file.path;

        const gitDiff = spawn("git", ["diff", "--staged", "--word-diff=porcelain", "--", filePath], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitDiff.stdout.on('data', (data) => {
            const rawData: string = data.toString();
            // console.log(rawData);

            const partialLineDiffs: LineDiff[] = parseLineDiffs(rawData);

            // console.log(partialLineDiffs);
            lineDiffs.push(...partialLineDiffs);
        })

        // Note: this may get called multiple times before process exit
        gitDiff.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitDiff.on('exit', (code, signal) => {
            if (code === 1) {
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            resolve({ lines: lineDiffs });
        });
    })
}

import { spawn } from "child_process";
import type { File, FileDiff, LineDiff, TokenType } from "./types";
import { parseLineDiffs } from "./gitDiffUtils";

/*
# Unstaged files

## Unstaged tracked files
$ git diff --word-diff=porcelain <file-name>

## Unstaged untracked files
- git diff shows nothing because nothing to compare with
- solution: return all the lines of the untracked file 
$ cat <file-name>
*/

export function gitDiffUnstagedFileAsync(rootDirectory: string, file: File): Promise<FileDiff> {
    if (file.status === "untracked")
        return catFileAsync(rootDirectory, file, "Added");

    return diffTrackedFileAsync(rootDirectory, file);
}

function catFileAsync(rootDirectory: string, file: File, tokenType: TokenType): Promise<FileDiff> {
    return new Promise((resolve, reject) => {

        let error = "";
        const lineDiffs: LineDiff[] = [];

        const filePath = file.path;

        const cat = spawn("cat", [filePath], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        cat.stdout.on('data', (data) => {
            const rawData: string = data.toString();
            // console.log(rawData);

            const lineArray = rawData.split("\n")
            // console.log(lineArray);

            const partialLineDiffs: LineDiff[] = []
            lineArray.forEach(line => {
                partialLineDiffs.push([{ tokenType, line }])
            })

            // console.log(partialLineDiffs);
            lineDiffs.push(...partialLineDiffs);
        })

        // Note: this may get called multiple times before process exit
        cat.stderr.on('data', (data) => {
            error += `${data} `;
        });

        cat.on('exit', (code, signal) => {
            if (code === 1) {
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            resolve({ lines: lineDiffs });
        });
    })
}

function diffTrackedFileAsync(rootDirectory: string, file: File): Promise<FileDiff> {
    return new Promise((resolve, reject) => {

        let error = "";
        const lineDiffs: LineDiff[] = [];

        const filePath = file.path;

        // -- forces to be interpreted as filename, workaround for deleted files
        const gitDiff = spawn("git", ["diff", "--word-diff=porcelain", "--", filePath], {
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
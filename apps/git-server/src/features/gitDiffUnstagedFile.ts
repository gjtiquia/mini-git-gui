import { spawn } from "child_process";
import { File } from "./types";

/*
Ref: https://git-scm.com/docs/git-diff

option --word-diff=porcelain
- basically splits the line into tokens
- uses ~ to represent newline
- prefix "+" => added
- prefix "-" => removed
- prefix " " => unchanged

# Unstaged files

## Unstaged tracked files
$ git diff --word-diff=porcelain <file-name>

## Unstaged untracked files
- git diff shows nothing because nothing to compare with
- solution: return all the lines of the untracked file
*/

type FileDiff = { lines: LineDiff[] }
type LineDiff = TokenDiff[]
type TokenDiff = { tokenType: TokenType, line: string }
type TokenType = "Added" | "Removed" | "Unchanged" | "Gray"

export function gitDiffUnstagedFileAsync(rootDirectory: string, file: File): Promise<FileDiff> {
    if (file.status === "untracked")
        return diffUntrackedFileAsync(rootDirectory, file);

    return diffTrackedFileAsync(rootDirectory, file);
}

function diffUntrackedFileAsync(rootDirectory: string, file: File): Promise<FileDiff> {
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

            const parsedLines = rawData.split("\n")
            // console.log(parsedLines);

            const partialLineDiffs: LineDiff[] = []
            parsedLines.forEach(line => {
                partialLineDiffs.push([{ tokenType: "Added", line }])
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

        const gitDiff = spawn("git", ["diff", "--word-diff=porcelain", filePath], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitDiff.stdout.on('data', (data) => {
            const rawData: string = data.toString();
            // console.log(rawData);

            const parsedLines = rawData
                .split("\n")
                // Remove headers
                .filter(x => x.substring(0, 4) !== "diff")
                .filter(x => x.substring(0, 5) !== "index")
                .filter(x => x.substring(0, 3) !== "---")
                .filter(x => x.substring(0, 3) !== "+++")

            // console.log(parsedLines);

            const partialLineDiffs: LineDiff[] = [[]]
            parsedLines.forEach(line => {
                const lastLineDiff = partialLineDiffs[partialLineDiffs.length - 1];

                if (line.substring(0, 2) === "@@") {
                    lastLineDiff.push({ tokenType: "Gray", line })
                    partialLineDiffs.push([])
                    return;
                }

                const firstChar = line.substring(0, 1);
                if (firstChar === "~") {
                    partialLineDiffs.push([])
                    return;
                }

                if (firstChar === " ") {
                    lastLineDiff.push({ tokenType: "Unchanged", line: line.substring(1) });
                    return;
                }

                if (firstChar === "+") {
                    lastLineDiff.push({ tokenType: "Added", line: line.substring(1) });
                    return;
                }

                if (firstChar === "-") {
                    lastLineDiff.push({ tokenType: "Removed", line: line.substring(1) });
                    return;
                }
            })

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
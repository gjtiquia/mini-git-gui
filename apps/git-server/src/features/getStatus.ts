import { spawn } from "child_process";
import nodePath from 'path';
import { File, FileStatusCode, codeStatusMap } from "./types";

/* References
- https://git-scm.com/docs/git-status#_options
- https://git-scm.com/docs/git-status#_output
*/

interface WorkingTreeStatus {
    unstagedFiles: File[],
    stagedFiles: File[]
}

export function getStatusAsync(rootDirectory: string): Promise<WorkingTreeStatus> {
    return new Promise((resolve, reject) => {

        let error = "";

        let unstagedFiles: File[] = [];
        let stagedFiles: File[] = [];

        const gitStatus = spawn("git", ["status", "-u", "--porcelain"], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitStatus.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            const allFiles = rawData
                .split("\n")
                .filter(e => e.length > 0)
                .map(e => {

                    const X = e.substring(0, 1) as FileStatusCode;
                    const Y = e.substring(1, 2) as FileStatusCode;
                    const path = e.substring(3);
                    const name = nodePath.basename(path);

                    return { X, Y, path, name };
                })


            const partialUnstagedFiles = allFiles
                .filter(e => e.Y !== ' ') // Ignore unmodified files
                .map(e => {
                    return {
                        ...e,
                        code: e.Y,
                    }
                })
                .filter(e => e.code in codeStatusMap) // Ignore files with invalid status codes
                .map(e => {
                    return {
                        statusCode: e.code,
                        status: codeStatusMap[e.code],
                        path: e.path,
                        name: e.name,
                    }
                })

            const partialStagedFiles = allFiles
                .filter(e => e.X !== ' ') // Ignore unmodified files
                .map(e => {
                    return {
                        ...e,
                        code: e.X,
                    }
                })
                .filter(e => e.code in codeStatusMap) // Ignore files with invalid status codes
                .map(e => {
                    return {
                        statusCode: e.code,
                        status: codeStatusMap[e.code],
                        path: e.path,
                        name: e.name,
                    }
                })
                .filter(e => e.status !== "untracked") // Untracked files belong in unstaged

            // console.log("allFiles:", allFiles)
            // console.log("partialUnstagedFiles:", partialUnstagedFiles)
            // console.log("partialStagedFiles:", partialStagedFiles)

            unstagedFiles.push(...partialUnstagedFiles);
            stagedFiles.push(...partialStagedFiles);
        })

        // Note: this may get called multiple times before process exit
        gitStatus.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitStatus.on('exit', (code, signal) => {
            if (code === 1) {
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            const workingTreeStatus = {
                unstagedFiles,
                stagedFiles,
            }

            // console.log("workingTreeStatus:", workingTreeStatus);
            resolve(workingTreeStatus);
        });
    })
}
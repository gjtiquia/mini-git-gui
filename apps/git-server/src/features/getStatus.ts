import { spawn } from "child_process";

/* References
- https://git-scm.com/docs/git-status#_options
- https://git-scm.com/docs/git-status#_output
*/

interface WorkingTreeStatus {
    unstagedFiles: File[],
    stagedFiles: File[]
}

interface File {
    status: FileStatus,
    path: string,
}

type FileStatus =
    "unmodified"
    | "modified"
    | "file-type-changed"
    | "added"
    | "deleted"
    | "renamed"
    | "copied"
    | "updated-but-unmerged"

const codeStatusMap: Record<string, FileStatus> = {
    "M": "modified",
    "T": "file-type-changed",
    "A": "added",
    "D": "deleted",
    "R": "renamed",
    "C": "copied",
    "U": "updated-but-unmerged",
}

export function getStatusAsync(rootDirectory: string): Promise<WorkingTreeStatus> {
    return new Promise((resolve, reject) => {

        let error = "";

        let unstagedFiles: File[] = [];
        let stagedFiles: File[] = [];

        const gitStatus = spawn("git", ["status", "-u", "--porcelain"], {
            cwd: rootDirectory
        });

        gitStatus.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            const allFiles = rawData
                .split("\n")
                .filter(e => e.length > 0)
                .map(e => {

                    const X = e.substring(0, 1);
                    const Y = e.substring(1, 2);
                    const path = e.substring(3);

                    return { X, Y, path };
                })


            unstagedFiles = allFiles
                .filter(e => e.Y !== ' ')
                .map(e => {
                    return {
                        code: e.Y,
                        path: e.path
                    }
                })
                .filter(e => e.code in codeStatusMap)
                .map(e => {
                    return {
                        status: codeStatusMap[e.code],
                        path: e.path
                    }
                })

            stagedFiles = allFiles
                .filter(e => e.X !== ' ')
                .map(e => {
                    return {
                        code: e.Y,
                        path: e.path
                    }
                })
                .filter(e => e.code in codeStatusMap)
                .map(e => {
                    return {
                        status: codeStatusMap[e.code],
                        path: e.path
                    }
                })
        })

        // Note: this may get called multiple times before process exit
        gitStatus.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitStatus.on('exit', (code, signal) => {
            if (code === 1) {
                reject(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                return;
            }

            const workingTreeStatus = {
                unstagedFiles,
                stagedFiles,
            }

            resolve(workingTreeStatus);
        });
    })
}
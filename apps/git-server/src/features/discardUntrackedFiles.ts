import { spawn } from "child_process";
import { File } from "./types";
import { getUniquePathsAndOriginalPaths } from "./utils";

// Discard untracked files: git clean -f <file-1> <file-2> ...
// (remember to pass in filepath OR ELSE ALL UNTRACKED FILES WILL BE DELETED)
// (-f must be passed or else will not clean. fyi: -i for interactive mode)

export function discardUntrackedFilesAsync(rootDirectory: string, files: File[]): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const filePaths = getUniquePathsAndOriginalPaths(files);

        const gitClean = spawn("git", ["clean", "-f", ...filePaths], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitClean.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            // Do nothing with the raw data
            // console.log(rawData);
        })

        // Note: this may get called multiple times before process exit
        gitClean.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitClean.on('exit', (code, signal) => {
            if (code === 1) {
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            resolve();
        });
    })
}
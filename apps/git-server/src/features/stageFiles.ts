import { spawn } from "child_process";
import { File } from "./types";
import { getUniquePathsAndOriginalPaths } from "./utils";

export function stageFilesAsync(rootDirectory: string, files: File[]): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const filePaths = getUniquePathsAndOriginalPaths(files);

        const gitAdd = spawn("git", ["add", ...filePaths], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitAdd.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            // Do nothing with the raw data
            // console.log(rawData);
        })

        // Note: this may get called multiple times before process exit
        gitAdd.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitAdd.on('exit', (code, signal) => {
            if (code === 1) {
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            // console.log("git add success")
            resolve();
        });
    })
}
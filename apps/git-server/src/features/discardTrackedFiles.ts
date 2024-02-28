import { spawn } from "child_process";

// Tracked files: git restore <file-1> <file-2> ...
// (recommended by git status command)

export function discardTrackedFilesAsync(rootDirectory: string, filePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const gitRestore = spawn("git", ["restore", ...filePaths], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitRestore.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            // Do nothing with the raw data
            // console.log(rawData);
        })

        // Note: this may get called multiple times before process exit
        gitRestore.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitRestore.on('exit', (code, signal) => {
            if (code === 1) {
                reject(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                return;
            }

            resolve();
        });
    })
}
import { spawn } from "child_process";

// Unstage has same commands for tracked (existing) and untracked (new) files

// git restore --staged <file-1> <file-2> ...
// (recommended by git status command)

export function unstageFilesAsync(rootDirectory: string, filePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const gitRestore = spawn("git", ["restore", "--staged", ...filePaths], {
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
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            // console.log("git add success")
            resolve();
        });
    })
}
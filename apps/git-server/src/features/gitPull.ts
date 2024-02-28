import { spawn } from "child_process";

export function gitPullAsync(rootDirectory: string): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const gitPull = spawn("git", ["pull"], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitPull.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            // Do nothing with the raw data
            // console.log(rawData);
        })

        // Note: this may get called multiple times before process exit
        gitPull.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitPull.on('exit', (code, signal) => {
            if (code === 1) {
                reject(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                return;
            }

            resolve();
        });
    })
}
import { spawn } from "child_process";

export function gitPushAsync(rootDirectory: string): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const gitPush = spawn("git", ["push"], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitPush.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            // Do nothing with the raw data
            // console.log(rawData);
        })

        // Note: this may get called multiple times before process exit
        gitPush.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitPush.on('exit', (code, signal) => {
            if (code === 1) {
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            resolve();
        });
    })
}
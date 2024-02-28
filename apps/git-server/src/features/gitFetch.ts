import { spawn } from "child_process";

export function gitFetchAsync(rootDirectory: string): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const gitFetch = spawn("git", ["fetch"], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitFetch.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            // Do nothing with the raw data
            // console.log(rawData);
        })

        // Note: this may get called multiple times before process exit
        gitFetch.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitFetch.on('exit', (code, signal) => {
            if (code === 1) {
                reject(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                return;
            }

            resolve();
        });
    })
}
import { spawn } from "child_process";

export function commitFilesAsync(rootDirectory: string, message: string, description?: string): Promise<void> {
    return new Promise((resolve, reject) => {

        let error = "";

        const command = "git"
        const args = ["commit", "-m", message]

        if (description !== undefined) {
            args.push("-m");
            args.push(description);
        }

        console.log("commit files process command:", command);
        console.log("commit files process args:", args);

        const gitCommit = spawn(command, args, {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitCommit.stdout.on('data', (data) => {
            const rawData: string = data.toString();

            // Do nothing with the raw data
            // console.log(rawData);
        })

        // Note: this may get called multiple times before process exit
        gitCommit.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitCommit.on('exit', (code, signal) => {
            if (code === 1) {
                reject(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                return;
            }

            resolve();
        });
    })
}
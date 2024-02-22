import { spawn } from "child_process";

/* References
- https://git-scm.com/docs/git-status#_options
- https://git-scm.com/docs/git-status#_output
*/

interface Status {

}

export function getStatusAsync(rootDirectory: string): Promise<Status> {
    return new Promise((resolve, reject) => {

        let error = "";

        const gitStatus = spawn("git", ["status", "-u", "--porcelain"], {
            cwd: rootDirectory
        });

        gitStatus.stdout.on('data', (data) => {
            const rawData: string = data.toString();
            console.log(rawData);
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

            resolve({});
        });
    })
}
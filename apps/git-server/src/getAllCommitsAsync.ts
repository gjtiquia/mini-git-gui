import { spawn } from "child_process";

interface Commit {
    subject: string;
    author: string;
    hash: string;
    parentHashes: string[];
    timestamp: number;
    date: Date;
}

export function getAllCommitsAsync(rootDirectory: string): Promise<Commit[]> {

    return new Promise<Commit[]>((resolve, reject) => {

        const commitArray: Commit[] = [];
        let error = "";

        // Use these weird delimiters instead of just newline characters in-case of edge cases where those characters exist in the output
        const delimiter = ">>>MINI-GIT-GUI-DELIMITER<<<";
        const endline = ">>>MINI-GIT-GUI-ENDLINE<<<";

        // Reference: 
        // - https://git-scm.com/docs/git-log#_commit_formatting
        // - https://git-scm.com/docs/git-log#_pretty_formats

        // --all: show branches as well

        // format
        // - %x09 = tab character (eg. --pretty=format:%h%x09%an%x09%ad%x09%s)

        const gitLogChildProcess = spawn("git", ["log", "--all", `--pretty=format:%s${delimiter}%an${delimiter}%H${delimiter}%P${delimiter}%at${endline}`], {
            cwd: rootDirectory
        });

        // Note: this gets called multiple times before process exit
        gitLogChildProcess.stdout.on('data', (data) => {

            const rawData: string = data.toString();

            const formattedArray: Commit[] = rawData
                .split(endline)
                .filter(x => x.length > 0) // Some elements are empty
                .map(x => x.trim()) // Trims whitespaces and newline chars
                .map(x => {
                    const commitArray = x.split(delimiter);

                    const timestamp = Number.parseInt(commitArray[4]);
                    const parentHashes = commitArray[3].split(" ").filter(x => x.length > 0);

                    return {
                        subject: commitArray[0],
                        author: commitArray[1],
                        hash: commitArray[2],
                        parentHashes,
                        timestamp,
                        date: new Date(timestamp * 1000)
                    };
                });

            commitArray.push(...formattedArray);
        });

        gitLogChildProcess.stderr.on('data', (data) => {
            error = `${data}`;
        });

        gitLogChildProcess.on('exit', (code, signal) => {
            if (code === 1) {
                reject(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                return;
            }

            resolve(commitArray);
        });
    });
}

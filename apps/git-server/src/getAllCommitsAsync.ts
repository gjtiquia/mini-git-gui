import { spawn } from "child_process";

interface Commit {
    subject: string,
    author: string,

    hash: string,
    abbreviatedHash: string,

    parentHashes: string[],

    timestamp: number,

    refNames: string[],
    isHead: boolean,
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

        const gitLogChildProcess = spawn("git", ["log", "--all", `--pretty=format:%s${delimiter}%an${delimiter}%H${delimiter}%h${delimiter}%P${delimiter}%at${delimiter}%D${endline}`], {
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

                    const subject = commitArray[0];
                    const author = commitArray[1];

                    const hash = commitArray[2];
                    const abbreviatedHash = commitArray[3];

                    const parentHashes = commitArray[4].split(" ").filter(x => x.length > 0);

                    const timestamp = Number.parseInt(commitArray[5]);

                    let isHead = false;

                    const refNames = commitArray[6]
                        .split(",")
                        .filter(x => x.length > 0)
                        .map(x => x.trim())
                        .map(x => {

                            const headPrefix = "HEAD -> ";
                            if (x.includes(headPrefix)) {
                                isHead = true;
                                return x.replace(headPrefix, "")
                            }

                            return x;
                        })

                    return {
                        subject,
                        author,

                        hash,
                        abbreviatedHash,

                        parentHashes,

                        timestamp,

                        refNames,
                        isHead,
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

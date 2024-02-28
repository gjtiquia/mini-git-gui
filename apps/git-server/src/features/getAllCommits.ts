import { spawn } from "child_process";
import { delimiter, endline } from "./utils";

/* References
- https://git-scm.com/docs/git-log#_commit_formatting
- https://git-scm.com/docs/git-log#_pretty_formats

--all: show branches as well

format
- %x09 = tab character (eg. --pretty=format:%h%x09%an%x09%ad%x09%s)
*/

interface Commit {
    subject: string,
    author: string,

    hash: string,
    abbreviatedHash: string,

    parentHashes: string[],

    timestamp: number,

    references: Reference[],
}

interface Reference {
    name: string,
    isHead: boolean,
}

export function getAllCommitsAsync(rootDirectory: string): Promise<Commit[]> {

    return new Promise<Commit[]>((resolve, reject) => {

        const commitArray: Commit[] = [];
        let error = "";

        const gitLog = spawn("git", ["log", "--all", `--pretty=format:%s${delimiter}%an${delimiter}%H${delimiter}%h${delimiter}%P${delimiter}%at${delimiter}%D${endline}`], {
            cwd: rootDirectory
        });

        // Note: this may get called multiple times before process exit
        gitLog.stdout.on('data', (data) => {

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

                    const references = commitArray[6]
                        .split(",")
                        .filter(x => x.length > 0)
                        .map(x => x.trim())
                        .map(x => {

                            let isHead = false;
                            let name = x;

                            const headPrefix = "HEAD -> ";
                            if (x.includes(headPrefix)) {
                                isHead = true;
                                name = x.replace(headPrefix, "")
                            }

                            return {
                                name,
                                isHead,
                            }
                        })

                    return {
                        subject,
                        author,

                        hash,
                        abbreviatedHash,

                        parentHashes,

                        timestamp,

                        references,
                    };
                });

            commitArray.push(...formattedArray);
        });

        gitLog.stderr.on('data', (data) => {
            error += `${data} `;
        });

        gitLog.on('exit', (code, signal) => {
            if (code === 1) {
                console.error(`Child process exited with code ${code} and signal ${signal}, Error: ${error}`);
                reject(error);
                return;
            }

            resolve(commitArray);
        });
    });
}

import { spawn } from "child_process";

// Reference: 
// - https://git-scm.com/docs/git-log#_commit_formatting
// - https://git-scm.com/docs/git-log#_pretty_formats

// --all: show branches as well
// format
// - %x09 = tab character (eg. --pretty=format:%h%x09%an%x09%ad%x09%s)

// Use these weird delimiters instead of just newline characters in-case of edge cases where those characters exist in the output
const delimiter = ">>>MINI-GIT-GUI-DELIMITER<<<";
const endline = ">>>MINI-GIT-GUI-ENDLINE<<<"

const child = spawn("git", ["log", "--all", `--pretty=format:%s${delimiter}%an${delimiter}%H${delimiter}%P${delimiter}%at${endline}`], {
    cwd: "/Users/gjtiquia/Documents/Projects/SelfProjects/mini-text-editor"
});

// Note: this gets called multiple times before process exit
child.stdout.on('data', (data) => {

    const rawData: string = data.toString();
    const formattedArray = rawData
        .split(endline)
        .filter(x => x.length > 0) // Some elements are empty
        .map(x => x.trim()) // Trims whitespaces and newline chars
        .map(x => {
            const commitArray = x.split(delimiter)

            const timestamp = Number.parseInt(commitArray[4]);
            const parentHashes = commitArray[3].split(" ").filter(x => x.length > 0);

            return {
                subject: commitArray[0],
                author: commitArray[1],
                hash: commitArray[2],
                parentHashes,
                timestamp,
                date: new Date(timestamp * 1000)
            }
        })

    console.log(formattedArray)
    console.log("length", formattedArray.length);
});

child.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
});

child.on('exit', (code, signal) => {
    console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
});
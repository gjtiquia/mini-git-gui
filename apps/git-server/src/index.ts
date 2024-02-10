import { spawn } from "child_process";

// Reference: 
// - https://git-scm.com/docs/git-log#_commit_formatting
// - https://git-scm.com/docs/git-log#_pretty_formats

// --all: show branches as well
// 
const child = spawn("git", ["log", "--all", "--pretty=format:Subject: %s%nAuthor: %an%nHash: %H%nParent Hashes: %P%nAuthor Date: %ad%nUNIX Timestamp: %at%n"], {
    cwd: "/Users/gjtiquia/Documents/Projects/SelfProjects/mini-text-editor"
});

child.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`);
});

child.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
});

child.on('exit', function (code, signal) {
    console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
});
import { getAllCommitsAsync } from "./getAllCommitsAsync";

main()

async function main() {
    const rootDirectory = "/Users/gjtiquia/Documents/Projects/SelfProjects/mini-text-editor";
    const commits = await getAllCommitsAsync(rootDirectory);

    console.log(commits);
    console.log("total:", commits.length);
}
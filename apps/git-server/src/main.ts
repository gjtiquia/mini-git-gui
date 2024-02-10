import express from "express"
import cors from "cors";
import { getAllCommitsAsync } from "./getAllCommitsAsync";

console.log("Running @mini-git-gui/git-server...")

const app = express();
const PORT = 3000;

// Global Middleware
app.use(cors()); // Enable all origins

// Set Routes
app.get("/", async (req, res) => {

    // const rootDirectory = "/Users/gjtiquia/Documents/Projects/SelfProjects/mini-text-editor";
    const rootDirectory = "/Users/EuniceChen/Downloads/_GJDocuments/mini-git-gui"
    const commits = await getAllCommitsAsync(rootDirectory);

    console.log(commits);
    console.log("total:", commits.length);

    res.send(commits);
})

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
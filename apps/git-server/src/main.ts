import path from "path";
import express from "express";
import cors from "cors";
import { appRouter } from "./routes/appRouter";
import { getRootDirectory, setRootDirectory } from "./store";
import packageJson from "../package.json"

export function main(rootDirectory: string) {
    console.log("Mini Git GUI v" + packageJson.version)

    console.log("Running @mini-git-gui/git-server...")

    const app = express();
    const PORT = process.env.PORT || 3000;
    setRootDirectory(rootDirectory);

    // Global Middleware
    app.use(cors()); // Enable all origins

    // Static File Server
    const publicFilesPath = path.join(__dirname, "..", "public")
    app.use(express.static(publicFilesPath))

    // Set Routes
    app.get("/healthcheck", (_, res) => res.status(200).send({ message: "ok" }))
    app.use("/app", appRouter);

    app.listen(PORT, () => {
        console.log(`Server is running at: http://localhost:${PORT}`);
        console.log(`ROOT_DIRECTORY: ${getRootDirectory()}`)
        console.log('Press Ctrl+C to quit.');
    });

    // For quick tests
    // import { rootDirectory } from "./store";
    // import { getStatusAsync } from "./features/getStatus";
    // mainTest();
    // async function mainTest() {
    //     const response = await getStatusAsync(rootDirectory)
    //     console.log("main response:", response);
    // }
}

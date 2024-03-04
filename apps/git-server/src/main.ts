import express from "express"
import cors from "cors";
import { appRouter } from "./routes/appRouter";

console.log("Running @mini-git-gui/git-server...")

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors()); // Enable all origins

// Static File Server
app.use(express.static("public"))

// Set Routes
app.get("/healthcheck", (req, res) => res.status(200).send({ message: "ok" }))
app.use("/app", appRouter);

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
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
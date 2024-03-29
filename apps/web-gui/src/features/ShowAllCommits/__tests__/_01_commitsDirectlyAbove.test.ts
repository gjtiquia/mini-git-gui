import { describe, it, expect } from "vitest"
import type { Commits } from "../createCommitsWithGraphNodes";
import { createCommitsWithGraphNodesAsync } from "../createCommitsWithGraphNodes";
import type { GraphNodeSettings } from "../GraphNode";
import { dummyCommit } from "../dummyCommits";

describe("Commits Directly Above", () => {

    it("should work with single branch", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "002",
                parentHashes: ["001"]
            },
            {
                ...dummyCommit,
                hash: "001",
                parentHashes: ["000"]
            },
            {
                ...dummyCommit,
                hash: "000",
                parentHashes: []
            },
        ];

        await createCommitsWithGraphNodesAsync(commits); // Mock "Strict Mode", ensuring that the function is pure and does not modify the commit
        const commitsWithGraphNodes = await createCommitsWithGraphNodesAsync(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[1].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "None",
            },
        ]);
    })

    it("should work with merging branches", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "002",
                parentHashes: ["001", "000"]
            },
            {
                ...dummyCommit,
                hash: "001",
                parentHashes: ["000"]
            },
            {
                ...dummyCommit,
                hash: "000",
                parentHashes: []
            },
        ];

        await createCommitsWithGraphNodesAsync(commits); // Mock "Strict Mode", ensuring that the function is pure and does not modify the commit
        const commitsWithGraphNodes = await createCommitsWithGraphNodesAsync(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "RightHalf"
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "BottomHalf",
                horizontalLineType: "LeftHalf"
            }
        ]);

        expect(commitsWithGraphNodes[1].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None"
            },
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None"
            }
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "RightHalf"
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "TopHalf",
                horizontalLineType: "LeftHalf"
            }
        ]);
    })
})
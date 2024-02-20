import { describe, it, expect } from "vitest"
import type { Commits } from "../createCommitsWithGraphNodes";
import { createCommitsWithGraphNodesAsync } from "../createCommitsWithGraphNodes";
import type { GraphNodeSettings } from "../GraphNode";
import { dummyCommit } from "../dummyCommits";

describe("Top Commit To The Left", () => {

    it("should work left->right then top->bottom", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["001", "002"]
            },
            {
                ...dummyCommit,
                hash: "002",
                parentHashes: ["000"]
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
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None"
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None"
            }
        ]);
    })

    it("should work left->right then top->bottom then right->left", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "005",
                parentHashes: ["003"]
            },
            {
                ...dummyCommit,
                hash: "004",
                parentHashes: ["002"]
            },
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["000", "001"]
            },
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

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "RightHalf"
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "Full",
                horizontalLineType: "Full"
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "BottomHalf",
                horizontalLineType: "LeftHalf"
            }
        ]);

        expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None"
            },
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

        expect(commitsWithGraphNodes[4].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None"
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
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
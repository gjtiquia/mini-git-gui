import { describe, it, expect } from "vitest"
import type { Commits } from "../createCommitsWithGraphNodes";
import { createCommitsWithGraphNodes } from "../createCommitsWithGraphNodes";
import type { GraphNodeSettings } from "../GraphNode";

const dummyCommit: Commits[0] = {
    subject: "xxx",
    author: "xxx",
    abbreviatedHash: "123",
    hash: "123456",
    parentHashes: [],
    timestamp: 12345678
}

describe("Top Commit To The Right", () => {

    it("should work top->bottom then left->right", () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["001",]
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

        createCommitsWithGraphNodes(commits); // Mock "Strict Mode", ensuring that the function is pure and does not modify the commit
        const commitsWithGraphNodes = createCommitsWithGraphNodes(commits);

        expect(commitsWithGraphNodes[1].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None"
            },
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None"
            }
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
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

    it("should work left->right shortcut", () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["000",]
            },
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

        createCommitsWithGraphNodes(commits); // Mock "Strict Mode", ensuring that the function is pure and does not modify the commit
        const commitsWithGraphNodes = createCommitsWithGraphNodes(commits);

        expect(commitsWithGraphNodes[1].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "RightHalf"
            },
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "LeftHalf"
            }
        ]);
    })
})
import { describe, it, expect } from "vitest"
import type { Commits } from "./createCommitsWithGraphNodes";
import { createCommitsWithGraphNodes } from "./createCommitsWithGraphNodes";

const dummyCommit: Commits[0] = {
    subject: "xxx",
    author: "xxx",
    abbreviatedHash: "123",
    hash: "123456",
    parentHashes: [],
    timestamp: 12345678
}

describe("createCommitsWithGraphNodes", () => {
    it("should work with an empty array", () => {
        const commitsWithGraphNodes = createCommitsWithGraphNodes([]);
        expect(commitsWithGraphNodes).toHaveLength(0);
    })

    it("should work with a single commit", () => {
        const commits: Commits = [dummyCommit];
        const commitsWithGraphNodes = createCommitsWithGraphNodes(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toHaveLength(1);
        expect(commitsWithGraphNodes[0].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[0].graphNodes[0].verticalLineType).toStrictEqual("None");
        expect(commitsWithGraphNodes[0].graphNodes[0].horizontalLineType).toStrictEqual("None");
    })

    it("should work with single branch", () => {
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

        const commitsWithGraphNodes = createCommitsWithGraphNodes(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toHaveLength(1);
        expect(commitsWithGraphNodes[0].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[0].graphNodes[0].verticalLineType).toStrictEqual("BottomHalf");
        expect(commitsWithGraphNodes[0].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[1].graphNodes).toHaveLength(1);
        expect(commitsWithGraphNodes[1].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[1].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[1].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[2].graphNodes).toHaveLength(1);
        expect(commitsWithGraphNodes[2].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[2].graphNodes[0].verticalLineType).toStrictEqual("TopHalf");
        expect(commitsWithGraphNodes[2].graphNodes[0].horizontalLineType).toStrictEqual("None");
    })

    it("should work with two branches - Edge Case 1", () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["000"]
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
                parentHashes: ["999"]
            },
            {
                ...dummyCommit,
                hash: "999",
                parentHashes: []
            },
        ];

        const commitsWithGraphNodes = createCommitsWithGraphNodes(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toHaveLength(1);
        expect(commitsWithGraphNodes[0].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[0].graphNodes[0].verticalLineType).toStrictEqual("BottomHalf");
        expect(commitsWithGraphNodes[0].graphNodes[0].horizontalLineType).toStrictEqual("None");


        expect(commitsWithGraphNodes[1].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[1].graphNodes[0].centerType).toStrictEqual("None");
        expect(commitsWithGraphNodes[1].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[1].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[1].graphNodes[1].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[1].graphNodes[1].verticalLineType).toStrictEqual("BottomHalf");
        expect(commitsWithGraphNodes[1].graphNodes[1].horizontalLineType).toStrictEqual("None");


        expect(commitsWithGraphNodes[2].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[2].graphNodes[0].centerType).toStrictEqual("None");
        expect(commitsWithGraphNodes[2].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[2].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[2].graphNodes[1].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[2].graphNodes[1].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[2].graphNodes[1].horizontalLineType).toStrictEqual("None");


        expect(commitsWithGraphNodes[3].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[3].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[3].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[3].graphNodes[0].horizontalLineType).toStrictEqual("RightHalf");

        expect(commitsWithGraphNodes[3].graphNodes[1].centerType).toStrictEqual("RoundedCorner");
        expect(commitsWithGraphNodes[3].graphNodes[1].verticalLineType).toStrictEqual("TopHalf");
        expect(commitsWithGraphNodes[3].graphNodes[1].horizontalLineType).toStrictEqual("LeftHalf");

        expect(commitsWithGraphNodes[4].graphNodes).toHaveLength(1);

        expect(commitsWithGraphNodes[4].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[4].graphNodes[0].verticalLineType).toStrictEqual("TopHalf");
        expect(commitsWithGraphNodes[4].graphNodes[0].horizontalLineType).toStrictEqual("None");
    })

    it("should work with two branches - Edge Case 2", () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["001"]
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
                parentHashes: ["999"]
            },
            {
                ...dummyCommit,
                hash: "999",
                parentHashes: []
            },
        ];

        const commitsWithGraphNodes = createCommitsWithGraphNodes(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toHaveLength(1);
        expect(commitsWithGraphNodes[0].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[0].graphNodes[0].verticalLineType).toStrictEqual("BottomHalf");
        expect(commitsWithGraphNodes[0].graphNodes[0].horizontalLineType).toStrictEqual("None");


        expect(commitsWithGraphNodes[1].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[1].graphNodes[0].centerType).toStrictEqual("None");
        expect(commitsWithGraphNodes[1].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[1].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[1].graphNodes[1].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[1].graphNodes[1].verticalLineType).toStrictEqual("BottomHalf");
        expect(commitsWithGraphNodes[1].graphNodes[1].horizontalLineType).toStrictEqual("None");


        expect(commitsWithGraphNodes[2].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[2].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[2].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[2].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[2].graphNodes[1].centerType).toStrictEqual("None");
        expect(commitsWithGraphNodes[2].graphNodes[1].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[2].graphNodes[1].horizontalLineType).toStrictEqual("None");


        expect(commitsWithGraphNodes[3].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[3].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[3].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[3].graphNodes[0].horizontalLineType).toStrictEqual("RightHalf");

        expect(commitsWithGraphNodes[3].graphNodes[1].centerType).toStrictEqual("RoundedCorner");
        expect(commitsWithGraphNodes[3].graphNodes[1].verticalLineType).toStrictEqual("TopHalf");
        expect(commitsWithGraphNodes[3].graphNodes[1].horizontalLineType).toStrictEqual("LeftHalf");

        expect(commitsWithGraphNodes[4].graphNodes).toHaveLength(1);

        expect(commitsWithGraphNodes[4].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[4].graphNodes[0].verticalLineType).toStrictEqual("TopHalf");
        expect(commitsWithGraphNodes[4].graphNodes[0].horizontalLineType).toStrictEqual("None");
    })

    it("should work with two branches merging", () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["002", "001"]
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

        const commitsWithGraphNodes = createCommitsWithGraphNodes(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[0].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[0].graphNodes[0].verticalLineType).toStrictEqual("BottomHalf");
        expect(commitsWithGraphNodes[0].graphNodes[0].horizontalLineType).toStrictEqual("RightHalf");

        expect(commitsWithGraphNodes[0].graphNodes[1].centerType).toStrictEqual("RoundedCorner");
        expect(commitsWithGraphNodes[0].graphNodes[1].verticalLineType).toStrictEqual("BottomHalf");
        expect(commitsWithGraphNodes[0].graphNodes[1].horizontalLineType).toStrictEqual("LeftHalf");


        expect(commitsWithGraphNodes[1].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[1].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[1].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[1].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[1].graphNodes[1].centerType).toStrictEqual("None");
        expect(commitsWithGraphNodes[1].graphNodes[1].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[1].graphNodes[1].horizontalLineType).toStrictEqual("None");


        expect(commitsWithGraphNodes[2].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[2].graphNodes[0].centerType).toStrictEqual("None");
        expect(commitsWithGraphNodes[2].graphNodes[0].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[2].graphNodes[0].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[2].graphNodes[1].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[2].graphNodes[1].verticalLineType).toStrictEqual("Full");
        expect(commitsWithGraphNodes[2].graphNodes[1].horizontalLineType).toStrictEqual("None");

        expect(commitsWithGraphNodes[3].graphNodes).toHaveLength(2);

        expect(commitsWithGraphNodes[3].graphNodes[0].centerType).toStrictEqual("Circle");
        expect(commitsWithGraphNodes[3].graphNodes[0].verticalLineType).toStrictEqual("TopHalf");
        expect(commitsWithGraphNodes[3].graphNodes[0].horizontalLineType).toStrictEqual("RightHalf");

        expect(commitsWithGraphNodes[3].graphNodes[1].centerType).toStrictEqual("RoundedCorner");
        expect(commitsWithGraphNodes[3].graphNodes[1].verticalLineType).toStrictEqual("TopHalf");
        expect(commitsWithGraphNodes[3].graphNodes[1].horizontalLineType).toStrictEqual("LeftHalf");
    })
})
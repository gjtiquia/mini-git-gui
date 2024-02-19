import { describe, it, expect } from "vitest"
import type { Commits } from "../createCommitsWithGraphNodes";
import { createCommitsWithGraphNodesAsync } from "../createCommitsWithGraphNodes";
import type { GraphNodeSettings } from "../GraphNode";

const dummyCommit: Commits[0] = {
    subject: "xxx",
    author: "xxx",
    abbreviatedHash: "123",
    hash: "123456",
    parentHashes: [],
    timestamp: 12345678
}

describe("createCommitsWithGraphNodes", () => {
    it("should work with an empty array", async () => {
        const commitsWithGraphNodes = await createCommitsWithGraphNodesAsync([]);
        expect(commitsWithGraphNodes).toHaveLength(0);
    })

    it("should work with a single commit", async () => {
        const commits: Commits = [dummyCommit];

        await createCommitsWithGraphNodesAsync(commits); // Mock "Strict Mode", ensuring that the function is pure and does not modify the commit
        const commitsWithGraphNodes = await createCommitsWithGraphNodesAsync(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "None",
                horizontalLineType: "None",
            },
        ]);
    })

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

    it("should work with two branches - Edge Case 1", async () => {
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
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "TopHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);

        expect(commitsWithGraphNodes[4].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "None",
            },
        ]);
    })

    it("should work with two branches - Edge Case 2", async () => {
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
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "TopHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);

        expect(commitsWithGraphNodes[4].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "None",
            },
        ]);
    })

    it("should work with two branches - Edge Case 3", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "010",
                parentHashes: ["009"]
            },
            {
                ...dummyCommit,
                hash: "009",
                parentHashes: ["008"]
            },
            {
                ...dummyCommit,
                hash: "008",
                parentHashes: ["006"]
            },
            {
                ...dummyCommit,
                hash: "007",
                parentHashes: ["002"]
            },
            {
                ...dummyCommit,
                hash: "006",
                parentHashes: ["005"]
            },
            {
                ...dummyCommit,
                hash: "005",
                parentHashes: ["004"]
            },
            {
                ...dummyCommit,
                hash: "004",
                parentHashes: ["003"]
            },
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["002"]
            },
            {
                ...dummyCommit,
                hash: "002",
                parentHashes: ["001"]
            },
            {
                ...dummyCommit,
                hash: "001",
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
    })

    it("should work with two branches merging - Edge Case 1", async () => {
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

        await createCommitsWithGraphNodesAsync(commits); // Mock "Strict Mode", ensuring that the function is pure and does not modify the commit
        const commitsWithGraphNodes = await createCommitsWithGraphNodesAsync(commits);

        expect(commitsWithGraphNodes[0].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "BottomHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);

        expect(commitsWithGraphNodes[1].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "TopHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);
    })

    it("should work with two branches merging - Edge Case 2", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["001", "002"] // Swapped
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
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "BottomHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);


        expect(commitsWithGraphNodes[1].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);


        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "TopHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);
    })

    it("should work with two branches merging - Edge Case 3", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "004",
                parentHashes: ["001"]
            },
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
                centerType: "RoundedCorner",
                verticalLineType: "Full",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },

        ]);

        expect(commitsWithGraphNodes[4].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "TopHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);
    })

    it("should work for two branches merging - Edge Case 4", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "006",
                parentHashes: ["004"]
            },
            {
                ...dummyCommit,
                hash: "005",
                parentHashes: ["002"]
            },
            {
                ...dummyCommit,
                hash: "004",
                parentHashes: ["003", "002"]
            },
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
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "Full",
                horizontalLineType: "LeftHalf",
            },
        ]);

        expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[4].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[5].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[6].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "TopHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);
    })

    it("should work for two branches merging - Edge Case 5", async () => {
        const commits: Commits = [
            {
                ...dummyCommit,
                hash: "006",
                parentHashes: ["003"]
            },
            {
                ...dummyCommit,
                hash: "005",
                parentHashes: ["004"]
            },
            {
                ...dummyCommit,
                hash: "004",
                parentHashes: ["001", "002"]
            },
            {
                ...dummyCommit,
                hash: "003",
                parentHashes: ["002"]
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
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[1].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None",
            },
        ]);

        expect(commitsWithGraphNodes[2].graphNodes).toStrictEqual<GraphNodeSettings[]>([
            {
                centerType: "None",
                verticalLineType: "Full",
                horizontalLineType: "None",
            },
            {
                centerType: "Circle",
                verticalLineType: "Full",
                horizontalLineType: "RightHalf",
            },
            {
                centerType: "RoundedCorner",
                verticalLineType: "BottomHalf",
                horizontalLineType: "LeftHalf",
            },
        ]);

        // TODO : 

        // expect(commitsWithGraphNodes[3].graphNodes).toStrictEqual<GraphNodeSettings[]>([
        //     {
        //         centerType: "Circle",
        //         verticalLineType: "Full",
        //         horizontalLineType: "None",
        //     },
        //     {
        //         centerType: "None",
        //         verticalLineType: "Full",
        //         horizontalLineType: "None",
        //     },
        // ]);

        // expect(commitsWithGraphNodes[4].graphNodes).toStrictEqual<GraphNodeSettings[]>([
        //     {
        //         centerType: "None",
        //         verticalLineType: "Full",
        //         horizontalLineType: "None",
        //     },
        //     {
        //         centerType: "Circle",
        //         verticalLineType: "Full",
        //         horizontalLineType: "None",
        //     },
        // ]);

        // expect(commitsWithGraphNodes[5].graphNodes).toStrictEqual<GraphNodeSettings[]>([
        //     {
        //         centerType: "Circle",
        //         verticalLineType: "Full",
        //         horizontalLineType: "None",
        //     },
        //     {
        //         centerType: "None",
        //         verticalLineType: "Full",
        //         horizontalLineType: "None",
        //     },
        // ]);

        // expect(commitsWithGraphNodes[6].graphNodes).toStrictEqual<GraphNodeSettings[]>([
        //     {
        //         centerType: "Circle",
        //         verticalLineType: "TopHalf",
        //         horizontalLineType: "RightHalf",
        //     },
        //     {
        //         centerType: "RoundedCorner",
        //         verticalLineType: "TopHalf",
        //         horizontalLineType: "LeftHalf",
        //     },
        // ]);
    })
})
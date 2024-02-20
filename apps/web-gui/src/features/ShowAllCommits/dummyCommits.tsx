import { Commits } from "./createCommitsWithGraphNodes";

export const dummyCommit: Commits[0] = {
    subject: "xxx",
    author: "xxx",
    abbreviatedHash: "123",
    hash: "123456",
    parentHashes: [],
    timestamp: 12345678,
    references: [],
};

// For quickly rendering test cases
const commits: Commits = [
    {
        ...dummyCommit,
        hash: "005",
        parentHashes: ["004",]
    },
    {
        ...dummyCommit,
        hash: "004",
        parentHashes: ["002",]
    },

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

export const dummyCommits: Commits = commits.map(x => ({
    ...x,
    subject: x.hash,
    abbreviatedHash: x.hash
}));



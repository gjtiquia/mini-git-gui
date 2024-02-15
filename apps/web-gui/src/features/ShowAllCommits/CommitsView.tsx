import { trpc } from "../../lib/trpc";
import { GraphNode } from "./GraphNode";
import { Commits, createCommitsWithGraphNodes } from "./createCommitsWithGraphNodes";

export function CommitsView() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isPending)
        return <p>Loading...</p>

    if (getCommitsQuery.isError)
        return <p className="text-red-500">Error: {getCommitsQuery.error.message}</p>

    const commitsWithGraphNodes = createCommitsWithGraphNodes(getCommitsQuery.data);
    // const commitsWithGraphNodes = createCommitsWithGraphNodes(dummyCommits);

    return (
        <div className="px-2 pt-1 flex flex-col">
            {commitsWithGraphNodes.map(commit => {

                const commitDate = new Date(commit.timestamp * 1000);

                return (
                    <div key={commit.hash} className="flex gap-2">

                        <div className="flex">
                            {commit.graphNodes.map((settings, index) => {
                                return <GraphNode key={commit.hash + index} settings={settings} />;
                            })}
                        </div>

                        <div className="flex-grow pb-1">
                            <p className="font-bold text-xs line-clamp-1">{commit.subject}</p>

                            <div className="flex justify-between text-xs">
                                <p className="line-clamp-1">{commit.author}</p>
                                <p className="line-clamp-1">{commit.abbreviatedHash}</p>
                                <p className="line-clamp-1">{commitDate.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const dummyCommit: Commits[0] = {
    subject: "xxx",
    author: "xxx",
    abbreviatedHash: "123",
    hash: "123456",
    parentHashes: [],
    timestamp: 12345678
}

// For quickly rendering test cases
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummyCommits: Commits = commits.map(x => ({
    ...x,
    subject: x.hash,
    abbreviatedHash: x.hash
}))


import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { GraphNode } from "./GraphNode";
import { Commits, createCommitsWithGraphNodesAsync } from "./createCommitsWithGraphNodes";

export function CommitsView() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isPending)
        return <p>Loading git commits...</p>

    if (getCommitsQuery.isError)
        return <p className="text-red-500">Error: {getCommitsQuery.error.message}</p>

    return (
        <CommitsViewWithGraph commits={getCommitsQuery.data} />
    );
}

function CommitsViewWithGraph(props: { commits: Commits }) {

    const generateGraphNodesQuery = useQuery({
        queryKey: ["generateGraphNodes"],
        queryFn: async () => {

            const commitsWithGraphNodes = await createCommitsWithGraphNodesAsync(props.commits);

            // const commitsWithGraphNodes = await createCommitsWithGraphNodesAsync(dummyCommits);
            // console.log(commitsWithGraphNodes);

            return commitsWithGraphNodes;
        }
    })

    if (generateGraphNodesQuery.isPending)
        return <p>Generating Graph...</p>

    if (generateGraphNodesQuery.isError)
        return <p className="text-red-500">Error: {generateGraphNodesQuery.error.message}</p>

    const commitsWithGraphNodes = generateGraphNodesQuery.data;

    return (
        <div className="flex flex-col">
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


const dummyCommits: Commits = commits.map(x => ({
    ...x,
    subject: x.hash,
    abbreviatedHash: x.hash
}))


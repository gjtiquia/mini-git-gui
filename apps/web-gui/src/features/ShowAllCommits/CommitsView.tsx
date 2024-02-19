import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { GraphNode } from "./GraphNode";
import { Commits, createCommitsWithGraphNodesAsync } from "./createCommitsWithGraphNodes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

    const color = "orange";

    return (
        <div className="flex flex-col">
            {commitsWithGraphNodes.map((commit, index, array) => {


                const commitDate = new Date(commit.timestamp * 1000);

                const refNames = commit.refNames.filter((refName, index, array) => {

                    const isRemote = refName.includes("origin/");
                    if (!isRemote) return true;

                    const localName = refName.replace("origin/", "");
                    if (array.includes(localName))
                        return false;

                    return true;
                });

                const isLast = index === array.length - 1;

                return <>
                    <div key={commit.hash} className="flex gap-2">

                        <div className="flex">
                            {commit.graphNodes.map((settings, index) => {
                                return (
                                    <GraphNode
                                        key={commit.hash + index}
                                        settings={settings}
                                        options={{ color }}
                                    />);
                            })}
                        </div>

                        {/* Use the y padding here for space between commits */}
                        <div className="flex-grow pt-1 flex flex-col gap-1">
                            <div className="flex gap-1 flex-wrap">
                                <p className="font-bold text-sm line-clamp-1">{commit.subject}</p>
                            </div>

                            <div className="flex justify-between text-xs">
                                <p className="line-clamp-1">{commit.author}</p>
                                <p className="line-clamp-1">{commit.abbreviatedHash}</p>
                                <p className="line-clamp-1">{commitDate.toLocaleString()}</p>
                            </div>

                            {commit.refNames.length > 0 &&
                                <div className="flex gap-1 items-center">
                                    {refNames.map(refName => (
                                        <Badge
                                            className="line-clamp-1"
                                            variant={commit.isHead ? "default" : "outline"}
                                        >
                                            {refName}
                                        </Badge>
                                    ))}
                                </div>
                            }

                            {!isLast &&
                                <div className="pt-1">
                                    <Separator />
                                </div>
                            }
                        </div>
                    </div>
                </>;
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
    timestamp: 12345678,
    refNames: [],
    isHead: false,
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


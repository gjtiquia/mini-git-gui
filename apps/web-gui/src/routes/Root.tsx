import { AppRouterOutput, trpc } from "../lib/trpc"

export function Root() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isPending)
        return <p>Loading...</p>

    if (getCommitsQuery.isError)
        return <p className="text-red-500">Error: {getCommitsQuery.error.message}</p>

    return <CommitsView commits={getCommitsQuery.data} />
}

type Commits = AppRouterOutput["getAllCommits"];

type NodeType = "None" | "Circle"
type LineType = "None" | "Full" | "Top" | "Bottom"

interface Node {
    nodeType: NodeType,
    lineType: LineType
}

function CommitsView(props: { commits: Commits }) {

    const commitArray = props.commits.map((commit, index) => {

        const nodeArray: Node[] = []

        const isEven = index % 2 === 0;
        if (isEven) {
            nodeArray.push({
                nodeType: "Circle",
                lineType: "Full"
            });
        }
        else {
            nodeArray.push({
                nodeType: "Circle",
                lineType: "Full"
            });

            nodeArray.push({
                nodeType: "Circle",
                lineType: "None"
            });
        }

        return {
            ...commit,
            nodeArray
        }
    });

    return (
        <div className="flex flex-col">
            {commitArray.map(commit => {
                const date = new Date(commit.timestamp * 1000);

                return (
                    <div key={commit.hash} className="flex gap-2 px-2">

                        {commit.nodeArray.map((node, nodeIndex) => {
                            return <NodeElement key={commit.hash + nodeIndex} node={node} />
                        })}

                        <div className="flex-grow py-1">
                            <p className="font-bold text-sm line-clamp-1">{commit.subject}</p>

                            <div className="flex justify-between gap-2 text-xs">
                                <p>{commit.author}</p>
                                <p>{commit.abbreviatedHash}</p>
                                <p>{date.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function NodeElement(props: { node: Node }) {

    if (props.node.lineType === "Full")
        return <FullLine />

    if (props.node.nodeType === "Circle")
        return <Circle />

    return <Empty />
}

function Circle() {

    return (
        <svg
            viewBox="0 0 100 100" // Shift origin from top left to center + Make it responsive
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-2 max-w-2"
        >
            <circle cx="50" cy="50" r="50" fill="red" />
        </svg>
    );
}

function Empty() {
    return (
        <svg
            viewBox="0 0 100 100" // Makes it responsive
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-2 max-w-2"
        >
            {/* Nothing */}
        </svg>
    );
}

function FullLine() {
    return (
        <svg
            viewBox="0 0 100 100" // Make it responsive
            preserveAspectRatio="none" // Stretches and distorts the rect to fill the entire svg
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-2 max-w-2"
        >
            <rect x="25" y="0" width="40" height="100" fill="red" />
        </svg>
    );
}
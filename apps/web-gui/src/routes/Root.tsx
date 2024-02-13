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
type LineType = "None" | "Full" | "TopHalf" | "BottomHalf"

interface NodeSettings {
    nodeType: NodeType,
    lineType: LineType
}

function CommitsView(props: { commits: Commits }) {

    const commitArray = props.commits.map((commit, index, array) => {

        const nodeArray: NodeSettings[] = []

        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        const isFirstOrLast = isFirst || isLast;

        const line: LineType =
            isFirst ? "BottomHalf"
                : isLast ? "TopHalf"
                    : "Full";

        const isEven = index % 2 === 0;
        if (isEven) {
            nodeArray.push({
                nodeType: "Circle",
                lineType: line
            });

            if (!isFirstOrLast)
                nodeArray.push({
                    nodeType: "None",
                    lineType: "TopHalf"
                });
        }
        else {
            nodeArray.push({
                nodeType: isFirstOrLast ? "Circle" : "None",
                lineType: line
            });

            if (!isFirstOrLast)
                nodeArray.push({
                    nodeType: "Circle",
                    lineType: "BottomHalf"
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
                            return <Node key={commit.hash + nodeIndex} nodeSettings={node} />
                        })}

                        <div className="flex-grow py-1">
                            <p className="font-bold text-sm line-clamp-1">{commit.subject}</p>

                            <div className="flex justify-between gap-2 text-xs">
                                <p className="line-clamp-1">{commit.author}</p>
                                <p className="line-clamp-1">{commit.abbreviatedHash}</p>
                                <p className="line-clamp-1">{date.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function Node(props: { nodeSettings: NodeSettings }) {
    return (
        <div className="relative min-w-2 max-w-2">
            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center">
                <NodeElement nodeType={props.nodeSettings.nodeType} />
            </div>

            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center">
                <LineElement lineType={props.nodeSettings.lineType} />
            </div>
        </div>
    )
}

function NodeElement(props: { nodeType: NodeType }) {
    if (props.nodeType === "Circle")
        return <Circle />

    return null;
}

function Circle() {

    const radius = 50;
    const color = "red";

    return (
        <svg
            viewBox="0 0 100 100" // Shift origin from top left to center + Make it responsive
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-full max-w-full"
        >
            <circle cx="50" cy="50" r={radius} fill={color} />
        </svg>
    );
}

function LineElement(props: { lineType: LineType }) {

    if (props.lineType === "None")
        return null;

    const width = 40;
    const color = "red";

    let y: number = 0;
    let height: number = 0;

    if (props.lineType === "Full") {
        y = 0;
        height = 100;
    }

    if (props.lineType === "TopHalf") {
        y = 0;
        height = 50;
    }

    if (props.lineType === "BottomHalf") {
        y = 50;
        height = 50
    }

    return (
        <svg
            viewBox="0 0 100 100" // Make it responsive
            preserveAspectRatio="none" // Stretches and distorts the rect to fill the entire svg
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-full max-w-full h-full"
        >
            <rect
                x={50 - width / 2}
                y={y}
                width={width}
                height={height}
                fill={color}
            />
        </svg>
    );
}
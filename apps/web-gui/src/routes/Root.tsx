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

type CenterType = "None" | "Circle" | "RoundedCorner"
type VerticalLineType = "None" | "Full" | "TopHalf" | "BottomHalf"
type HorizontalLineType = "None" | "LeftHalf" | "RightHalf"

interface NodeSettings {
    centerType: CenterType,
    verticalLineType: VerticalLineType,
    horizontalLineType: HorizontalLineType,
}

function CommitsView(props: { commits: Commits }) {

    const commitArray = props.commits.map((commit, index, array) => {

        const nodeArray: NodeSettings[] = []

        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        const isFirstOrLast = isFirst || isLast;

        const defaultVerticalLine: VerticalLineType =
            isFirst ? "BottomHalf"
                : isLast ? "TopHalf"
                    : "Full"

        const isEven = index % 2 === 0;
        if (isEven) {
            nodeArray.push({
                centerType: "Circle",
                verticalLineType: defaultVerticalLine,
                horizontalLineType: isFirst ? "None" : "RightHalf",
            });

            if (!isFirst)
                nodeArray.push({
                    centerType: "RoundedCorner",
                    verticalLineType: "TopHalf",
                    horizontalLineType: "LeftHalf",
                });
        }
        else {
            nodeArray.push({
                centerType: isFirstOrLast ? "Circle" : "None",
                verticalLineType: defaultVerticalLine,
                horizontalLineType: "None",
            });

            if (!isFirstOrLast)
                nodeArray.push({
                    centerType: "Circle",
                    verticalLineType: "BottomHalf",
                    horizontalLineType: "None",
                });
        }

        return {
            ...commit,
            nodeArray
        }
    });

    return (
        <div className="px-2 pt-1 flex flex-col">
            {commitArray.map(commit => {
                const date = new Date(commit.timestamp * 1000);

                return (
                    <div key={commit.hash} className="flex gap-2">

                        <div className="flex">
                            {commit.nodeArray.map((node, nodeIndex) => {
                                return <Node key={commit.hash + nodeIndex} nodeSettings={node} />
                            })}
                        </div>

                        <div className="flex-grow pb-1">
                            <p className="font-bold text-xs line-clamp-1">{commit.subject}</p>

                            <div className="flex justify-between text-xs">
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

    const strokeWidth = 16;

    return (
        <div className="relative min-w-3 max-w-3">
            <div className="absolute top-0 left-0 h-full w-full flex justify-center">
                <div className="h-full min-w-full max-w-full flex flex-col justify-center">
                    <CenterElement type={props.nodeSettings.centerType} strokeWidth={strokeWidth} />
                </div>
            </div>

            <div className="absolute top-0 left-0 h-full w-full flex justify-center">
                <div className="h-full min-w-full max-w-full flex flex-col justify-center">
                    <VerticalLineElement type={props.nodeSettings.verticalLineType} strokeWidth={strokeWidth} />
                </div>
            </div>

            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center">
                <HorizontalLineElement type={props.nodeSettings.horizontalLineType} strokeWidth={strokeWidth} />
            </div>
        </div>
    )
}

function CenterElement(props: { type: CenterType, strokeWidth: number }) {
    if (props.type === "Circle")
        return <Circle radius={28} />

    if (props.type === "RoundedCorner")
        return <Circle radius={props.strokeWidth / 2} />

    return null;
}

function Circle(props: { radius: number }) {

    const radius = Math.min(props.radius, 50); // Max radius is 50, because view box is 100
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

function VerticalLineElement(props: { type: VerticalLineType, strokeWidth: number }) {

    if (props.type === "None")
        return null;

    const strokeWidth = props.strokeWidth;
    const color = "red";

    let y: number = 0;
    let rectHeight: number = 0;

    if (props.type === "Full") {
        y = 0;
        rectHeight = 100;
    }

    if (props.type === "TopHalf") {
        y = 0;
        rectHeight = 50;
    }

    if (props.type === "BottomHalf") {
        y = 50;
        rectHeight = 50
    }

    return (
        <svg
            viewBox="0 0 100 100" // Make it responsive
            preserveAspectRatio="none" // Stretches and distorts the rect to fill the entire svg
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-full max-w-full h-full"
        >
            <rect
                x={50 - strokeWidth / 2}
                y={y}
                width={strokeWidth}
                height={rectHeight}
                fill={color}
            />
        </svg>
    );
}

function HorizontalLineElement(props: { type: HorizontalLineType, strokeWidth: number }) {

    if (props.type === "None")
        return null;

    const strokeWidth = props.strokeWidth;
    const color = "red";

    let x: number = 0;
    let rectWidth: number = 0;

    if (props.type === "LeftHalf") {
        x = 0;
        rectWidth = 50;
    }

    if (props.type === "RightHalf") {
        x = 50;
        rectWidth = 50
    }

    return (
        <svg
            viewBox="0 0 100 100" // Make it responsive
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-full max-w-full h-full"
        >
            <rect
                x={x}
                y={50 - strokeWidth / 2}
                width={rectWidth}
                height={strokeWidth}
                fill={color}
            />
        </svg>
    );
}
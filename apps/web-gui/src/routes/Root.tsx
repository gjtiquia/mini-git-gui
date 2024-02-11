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
type NodeType = "Node" | "Empty" | "Line"

function CommitsView(props: { commits: Commits }) {

    const renderArray = props.commits.map((commit, index) => {

        const nodeArray: NodeType[] = []

        const isEven = index % 2 === 0;
        if (isEven) {
            nodeArray.push("Node");
        }
        else {
            nodeArray.push("Line");
            nodeArray.push("Node");
        }

        return {
            ...commit,
            nodeArray
        }
    });

    return (
        <div className="flex flex-col">
            {renderArray.map(x => {
                const date = new Date(x.timestamp * 1000);

                return (
                    <div key={x.hash} className="flex gap-2 px-2 py-1">

                        {x.nodeArray.map((nodeType, index) => {
                            switch (nodeType) {
                                case "Node": return <Node key={x.hash + index} />
                                case "Empty": return <Empty key={x.hash + index} />
                                case "Line": return <Line key={x.hash + index} />
                            }
                        })}

                        <div className="flex-grow">
                            <p className="font-bold text-sm line-clamp-1">{x.subject}</p>

                            <div className="flex justify-between gap-2 text-xs">
                                <p>{x.author}</p>
                                <p>{x.abbreviatedHash}</p>
                                <p>{date.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function Node() {

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
            {/* <circle cx="0" cy="0" r="50%" fill="red" /> */}
        </svg>
    );
}

function Line() {

    // TODO : Hardcoded a straight line with div for now
    return (
        <div className="min-w-2 max-w-2 flex justify-center">
            <div className="h-full bg-red-500 w-1" />
        </div>
    )

    return (
        <svg
            viewBox="0 0 100 100" // Shift origin from top left to center + Make it responsive
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-2 max-w-2"
        // className="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px]"
        >
            {/* <circle cx="0" cy="0" r="50%" fill="red" /> */}
            {/* <line x1="50" y1="0" x2="50" y2="100" className="stroke-red-500 stroke-[0.5rem]" /> */}
            <rect x="25" y="0" width="50" height="100" fill="red" />
        </svg>
    );
}
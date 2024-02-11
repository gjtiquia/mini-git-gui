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
            // nodeArray.push("Node");
            nodeArray.push("Line");
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
                    <div key={x.hash} className="flex gap-2 px-2">

                        {x.nodeArray.map((nodeType, index) => {
                            switch (nodeType) {
                                case "Node": return <Node key={x.hash + index} />
                                case "Empty": return <Empty key={x.hash + index} />
                                case "Line": return <Line key={x.hash + index} />
                            }
                        })}

                        <div className="flex-grow py-1">
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
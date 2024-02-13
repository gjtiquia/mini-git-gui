import { trpc } from "../../lib/trpc";
import { GraphNode } from "./GraphNode";
import { createCommitsWithGraphNodes } from "./createCommitsWithGraphNodes";

export function CommitsView() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isPending)
        return <p>Loading...</p>

    if (getCommitsQuery.isError)
        return <p className="text-red-500">Error: {getCommitsQuery.error.message}</p>

    const commitsWithGraphNodes = createCommitsWithGraphNodes(getCommitsQuery.data);

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



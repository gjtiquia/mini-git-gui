import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { GraphNode } from "./GraphNode";
import { Commits, createCommitsWithGraphNodesAsync } from "./createCommitsWithGraphNodes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { dummyCommits } from "./dummyCommits";

export function CommitsView() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isPending || getCommitsQuery.isFetching)
        return <p className="text-center">Loading git commits...</p>

    if (getCommitsQuery.isError)
        return <p className="text-red-500 text-center">Error: {getCommitsQuery.error.message}</p>

    return (
        <div className="overflow-y-scroll border-t rounded-md px-2 pb-2">
            <CommitsViewWithGraph commits={getCommitsQuery.data} />
        </div>
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

    if (generateGraphNodesQuery.isPending || generateGraphNodesQuery.isFetching)
        return <p className="text-center">Generating Graph...</p>

    if (generateGraphNodesQuery.isError)
        return <p className="text-red-500 text-center">Error: {generateGraphNodesQuery.error.message}</p>

    const commitsWithGraphNodes = generateGraphNodesQuery.data;

    const color = "orange";

    return (
        <div className="flex flex-col">
            {commitsWithGraphNodes.map((commit, index, array) => {

                const commitDate = new Date(commit.timestamp * 1000);

                const references = commit.references.filter((ref, index, array) => {

                    const isRemoteHead = ref.name === "origin/HEAD"
                    if (isRemoteHead)
                        return false;

                    const isRemote = ref.name.includes("origin/");
                    if (!isRemote)
                        return true;

                    const localName = ref.name.replace("origin/", "");
                    const alreadyHaveLocalBranchWithSameName = array.findIndex(x => x.name === localName) !== -1;
                    if (alreadyHaveLocalBranchWithSameName)
                        return false;

                    return true;
                });

                const isLast = index === array.length - 1;

                return (
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

                            {commit.references.length > 0 &&
                                <div className="flex gap-1 items-center">
                                    {references.map(ref => {
                                        return (
                                            <Badge
                                                key={ref.name}
                                                className="line-clamp-1"
                                                variant={ref.isHead ? "default" : "outline"}
                                            >
                                                {ref.name}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            }

                            {!isLast &&
                                <div className="pt-1">
                                    <Separator />
                                </div>
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

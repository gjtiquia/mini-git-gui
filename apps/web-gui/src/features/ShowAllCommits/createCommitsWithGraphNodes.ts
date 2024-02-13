import type { AppRouterOutput } from "../../lib/trpc";
import { GraphNodeSettings } from "./GraphNode/GraphNode";

export type Commits = AppRouterOutput["getAllCommits"]
type Commit = Commits[0]

interface CommitWithGraphNodes extends Commit {
    graphNodes: GraphNodeSettings[]
}

export function createCommitsWithGraphNodes(commits: Commits): CommitWithGraphNodes[] {

    if (commits.length === 1)
        return [{
            ...commits[0],
            graphNodes: [{
                centerType: "Circle",
                verticalLineType: "None",
                horizontalLineType: "None"
            }]
        }]

    const commitsWithGraphNodes: CommitWithGraphNodes[] = commits.map(commit => ({ ...commit, graphNodes: [] }));

    for (let i = 0; i < commitsWithGraphNodes.length; i++) {
        const commitWithGraphNodes = commitsWithGraphNodes[i];

        const isFirst = i === 0;
        const isLast = i === commitsWithGraphNodes.length - 1;

        if (isFirst) {
            commitWithGraphNodes.graphNodes.push({
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None"
            })

            continue;
        }

        if (isLast) {
            commitWithGraphNodes.graphNodes.push({
                centerType: "Circle",
                verticalLineType: "TopHalf",
                horizontalLineType: "None"
            })

            continue;
        }

        commitWithGraphNodes.graphNodes.push({
            centerType: "Circle",
            verticalLineType: "Full",
            horizontalLineType: "None"
        })
    }


    return commitsWithGraphNodes;
}

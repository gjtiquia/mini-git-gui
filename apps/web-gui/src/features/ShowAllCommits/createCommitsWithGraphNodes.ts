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
        const commit = commitsWithGraphNodes[i];

        // Initial commit
        if (commit.parentHashes.length === 0)
            break;

        let circleIndex = commit.graphNodes.findIndex(x => x.centerType === "Circle");
        if (circleIndex === -1) {

            commit.graphNodes.push({
                centerType: "Circle",
                verticalLineType: "BottomHalf",
                horizontalLineType: "None"
            })

            circleIndex = commit.graphNodes.length - 1;
        }
        else {
            // Is already a parent, should already have a circle and a TopHalf vertical line
            commit.graphNodes[circleIndex].verticalLineType = "Full"
        }

        for (let j = i + 1; j < commitsWithGraphNodes.length; j++) {
            const nextCommit = commitsWithGraphNodes[j];

            while (circleIndex > nextCommit.graphNodes.length - 1) {
                nextCommit.graphNodes.push({ centerType: "None", verticalLineType: "Full", horizontalLineType: "None" })
            }

            const isParent = commit.parentHashes.includes(nextCommit.hash);
            if (!isParent) continue;

            const parentCircleIndex = nextCommit.graphNodes.findIndex(x => x.centerType === "Circle");
            if (parentCircleIndex === -1) {
                nextCommit.graphNodes[circleIndex].centerType = "Circle";
                nextCommit.graphNodes[circleIndex].verticalLineType = "TopHalf";
            }
            else {
                nextCommit.graphNodes[circleIndex].centerType = "RoundedCorner";
                nextCommit.graphNodes[circleIndex].verticalLineType = "TopHalf";
                nextCommit.graphNodes[circleIndex].horizontalLineType = "LeftHalf";

                nextCommit.graphNodes[parentCircleIndex].horizontalLineType = "RightHalf";
            }

            break;
        }
    }


    return commitsWithGraphNodes;
}

import type { AppRouterOutput } from "../../lib/trpc";
import { CenterType } from "./GraphNode/CenterElement";
import { GraphNodeSettings } from "./GraphNode/GraphNode";
import { HorizontalLineType } from "./GraphNode/HorizontalLineElement";

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

        // Terminate if has no parents (eg. initial commit)
        if (commit.parentHashes.length === 0)
            break;

        let startingCircleIndex = commit.graphNodes.findIndex(x => x.centerType === "Circle");
        if (startingCircleIndex !== -1) {
            // Is already a parent, should already have a circle and a vertical line, ignore
            continue;
        }

        startingCircleIndex = commit.graphNodes.length;

        for (let parentIndex = 0; parentIndex < commit.parentHashes.length; parentIndex++) {

            const isFirst = parentIndex === 0;
            const isLast = parentIndex === commit.parentHashes.length - 1;
            const hasMoreThanOneParent = commit.parentHashes.length > 1;

            let centerType: CenterType = "None"
            let horizontalLineType: HorizontalLineType = "None";

            if (isFirst) {
                centerType = "Circle";
                horizontalLineType = hasMoreThanOneParent ? "RightHalf" : "None";
            }
            else if (isLast) {
                centerType = "RoundedCorner";
                horizontalLineType = hasMoreThanOneParent ? "LeftHalf" : "None";
            }
            else {
                centerType = "RoundedCorner";
                horizontalLineType = "Full";
            }

            commit.graphNodes.push({
                centerType,
                verticalLineType: "BottomHalf",
                horizontalLineType
            })
        }

        const targetParentHashes: (string | null)[] = [...commit.parentHashes]; // Clone the array!

        for (let j = i + 1; j < commitsWithGraphNodes.length; j++) {
            const nextCommit = commitsWithGraphNodes[j];

            for (let targetParentIndex = 0; targetParentIndex < targetParentHashes.length; targetParentIndex++) {

                const targetParentHash = targetParentHashes[targetParentIndex];
                if (targetParentHash === null) continue;

                const circleIndex = startingCircleIndex + targetParentIndex;
                while (circleIndex > nextCommit.graphNodes.length - 1) {
                    nextCommit.graphNodes.push({ centerType: "None", verticalLineType: "Full", horizontalLineType: "None" })
                }

                const istargetParent = nextCommit.hash === targetParentHash;
                if (!istargetParent) continue;

                const parentCircleIndex = nextCommit.graphNodes.findIndex(x => x.centerType === "Circle");
                if (parentCircleIndex !== -1) {

                    nextCommit.graphNodes[circleIndex].centerType = "RoundedCorner";
                    nextCommit.graphNodes[circleIndex].verticalLineType = "TopHalf";
                    nextCommit.graphNodes[circleIndex].horizontalLineType = "LeftHalf";

                    nextCommit.graphNodes[parentCircleIndex].horizontalLineType = "RightHalf";

                    targetParentHashes[targetParentIndex] = null;
                    continue;
                }

                nextCommit.graphNodes[circleIndex].centerType = "Circle";

                if (nextCommit.parentHashes.length === 0) {
                    nextCommit.graphNodes[circleIndex].verticalLineType = "TopHalf";
                    targetParentHashes[targetParentIndex] = null;
                    continue;
                }

                targetParentHashes[targetParentIndex] = nextCommit.parentHashes[0];
                for (let newParentHashIndex = 1; newParentHashIndex < nextCommit.parentHashes.length; newParentHashIndex++) {
                    const newParentHash = nextCommit.parentHashes[newParentHashIndex];
                    targetParentHashes.push(newParentHash);
                }
            }
        }
    }

    return commitsWithGraphNodes;
}

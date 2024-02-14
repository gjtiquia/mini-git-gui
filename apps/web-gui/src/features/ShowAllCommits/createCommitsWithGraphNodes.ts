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

    // Temporary shifting to remove top commits
    // commitsWithGraphNodes.shift();
    // commitsWithGraphNodes.shift();

    for (let baseCommitIndex = 0; baseCommitIndex < commitsWithGraphNodes.length; baseCommitIndex++) {

        const baseCommit = commitsWithGraphNodes[baseCommitIndex];

        const hasCircle = baseCommit.graphNodes.findIndex(x => x.centerType === "Circle") !== -1;
        if (hasCircle) continue;

        baseCommit.graphNodes.push({
            centerType: "Circle",
            verticalLineType: "BottomHalf",
            horizontalLineType: "None"
        })

        let currentCommit = baseCommit;
        let currentCommitIndex = baseCommitIndex;

        for (let baseCommitParentIndex = 0; baseCommitParentIndex < baseCommit.parentHashes.length; baseCommitParentIndex++) {

            const baseCommitParentHash = baseCommit.parentHashes[baseCommitParentIndex];
            let currentCommitParentHash = baseCommitParentHash;

            for (let nextCommitIndex = baseCommitIndex + 1; nextCommitIndex < commitsWithGraphNodes.length; nextCommitIndex++) {

                const nextCommit = commitsWithGraphNodes[nextCommitIndex];

                const isParentCommit = nextCommit.hash === currentCommitParentHash;
                if (!isParentCommit) continue;

                const parentCommit = nextCommit;
                const parentIndex = nextCommitIndex;

                let parentCircleIndex = parentCommit.graphNodes.findIndex(x => x.centerType === "Circle");
                const parentHasCircle = parentCircleIndex !== -1;

                if (parentHasCircle) {

                    const circleIndex = currentCommit.graphNodes.length - 1;

                    const parentIsOnTheLeft = parentCircleIndex < circleIndex;
                    const parentIsOnTheRight = parentCircleIndex > circleIndex;

                    let leftIndex = parentCircleIndex;
                    let rightIndex = circleIndex;

                    if (parentIsOnTheRight) {
                        leftIndex = circleIndex;
                        rightIndex = parentCircleIndex;
                    }

                    const hasMoreThanOneParent = parentCommit.parentHashes.length > 1;

                    if (hasMoreThanOneParent) {

                        // Check if parent has any commits above
                        let hasCommitAbove = false;
                        for (let commitAboveParentIndex = parentIndex - 1; commitAboveParentIndex > currentCommitIndex; commitAboveParentIndex--) {
                            const commitAboveParent = commitsWithGraphNodes[commitAboveParentIndex];

                            if (commitAboveParent.parentHashes.includes(currentCommitParentHash)) {
                                hasCommitAbove = true;
                                break;
                            }
                        }

                        // Shortcut
                        if (!hasCommitAbove) {

                            // Left Index
                            baseCommit.graphNodes[leftIndex].horizontalLineType = "RightHalf";

                            if (parentIsOnTheLeft)
                                baseCommit.graphNodes[leftIndex].centerType = "RoundedCorner"

                            // Middle Indexes
                            for (let middleIndex = leftIndex + 1; middleIndex < rightIndex; middleIndex++) {
                                baseCommit.graphNodes[middleIndex].horizontalLineType = "Full";
                                baseCommit.graphNodes[middleIndex].centerType = "RoundedCorner";
                            }

                            // Right Index
                            baseCommit.graphNodes[rightIndex].horizontalLineType = "LeftHalf"

                            if (parentIsOnTheRight)
                                baseCommit.graphNodes[rightIndex].centerType = "RoundedCorner"

                            // Terminate search for parent
                            break;
                        }
                    }

                    if (parentIsOnTheLeft) {

                        // Add empty graph nodes (if missing)
                        while (rightIndex > currentCommit.graphNodes.length - 1)
                            currentCommit.graphNodes.push({ centerType: "None", verticalLineType: "None", horizontalLineType: "None" })

                        while (rightIndex > parentCommit.graphNodes.length - 1)
                            parentCommit.graphNodes.push({ centerType: "None", verticalLineType: "None", horizontalLineType: "None" })

                        // Child on the right
                        parentCommit.graphNodes[rightIndex].centerType = "RoundedCorner";
                        parentCommit.graphNodes[rightIndex].verticalLineType = "TopHalf";
                    }

                    if (parentIsOnTheRight) {

                        // Child on the left
                        parentCommit.graphNodes[leftIndex].centerType = "RoundedCorner";
                        parentCommit.graphNodes[leftIndex].verticalLineType = "TopHalf";
                    }

                    // Left Index
                    parentCommit.graphNodes[leftIndex].horizontalLineType = "RightHalf";

                    // Middle Indexes
                    for (let middleIndex = leftIndex + 1; middleIndex < rightIndex; middleIndex++) {
                        parentCommit.graphNodes[middleIndex].centerType = "RoundedCorner";
                        parentCommit.graphNodes[middleIndex].horizontalLineType = "Full";
                    }

                    // Right Index
                    parentCommit.graphNodes[rightIndex].horizontalLineType = "LeftHalf";

                    // Draw the missing lines on the way back up
                    if (parentIsOnTheLeft) {
                        for (let i = parentIndex; i > baseCommitIndex; i--) {
                            const commitAboveParent = commitsWithGraphNodes[i];

                            if (rightIndex > commitAboveParent.graphNodes.length - 1) {
                                commitAboveParent.graphNodes.push({
                                    centerType: "None",
                                    verticalLineType: "Full",
                                    horizontalLineType: "None"
                                })
                            }
                        }

                        // TODO
                        // baseCommit.graphNodes[leftIndex].horizontalLineType = "RightHalf";

                        // if (rightIndex > baseCommit.graphNodes.length - 1) {
                        //     baseCommit.graphNodes.push({
                        //         centerType: "None",
                        //         verticalLineType: "BottomHalf",
                        //         horizontalLineType: "LeftHalf"
                        //     })
                        // }
                    }

                    // Terminate search for parent
                    break;
                }

                // if Parent has no Circle
                parentCommit.graphNodes.push({
                    centerType: "Circle",
                    verticalLineType: parentCommit.parentHashes.length > 0 ? "Full" : "TopHalf",
                    horizontalLineType: "None"
                })

                parentCircleIndex = parentCommit.graphNodes.length - 1;

                // Draw the missing lines on the way back up
                for (let i = parentIndex; i > currentCommitIndex; i--) {
                    const commitAboveParent = commitsWithGraphNodes[i];

                    if (parentCircleIndex > commitAboveParent.graphNodes.length - 1) {
                        commitAboveParent.graphNodes.push({
                            centerType: "None",
                            verticalLineType: "Full",
                            horizontalLineType: "None"
                        })
                    }
                }

                if (parentCommit.parentHashes.length === 0) {
                    // Terminate search for parent
                    break;
                }

                currentCommit = parentCommit;
                currentCommitIndex = parentIndex;
                currentCommitParentHash = parentCommit.parentHashes[0];
            }
        }
    }

    return commitsWithGraphNodes;
}

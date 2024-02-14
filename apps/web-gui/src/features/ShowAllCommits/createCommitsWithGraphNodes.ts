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

    for (let commitIndex = 0; commitIndex < commitsWithGraphNodes.length; commitIndex++) {

        const commit = commitsWithGraphNodes[commitIndex];

        const hasCircle = commit.graphNodes.findIndex(x => x.centerType === "Circle") !== -1;
        if (hasCircle) continue;

        commit.graphNodes.push({
            centerType: "Circle",
            verticalLineType: "BottomHalf",
            horizontalLineType: "None"
        })

        let targetCommit = commit;
        let targetCommitIndex = commitIndex;

        for (let parentCommitIndex = 0; parentCommitIndex < commit.parentHashes.length; parentCommitIndex++) {

            let parentCommitHash = commit.parentHashes[parentCommitIndex];

            for (let nextCommitIndex = commitIndex + 1; nextCommitIndex < commitsWithGraphNodes.length; nextCommitIndex++) {

                const nextCommit = commitsWithGraphNodes[nextCommitIndex];

                const isParentCommit = nextCommit.hash === parentCommitHash;
                if (!isParentCommit) {
                    nextCommit.graphNodes.push({
                        centerType: "None",
                        verticalLineType: "Full",
                        horizontalLineType: "None"
                    })

                    continue;
                }

                const parentCircleIndex = nextCommit.graphNodes.findIndex(x => x.centerType === "Circle");
                const parentHasCircle = parentCircleIndex !== -1;

                if (parentHasCircle) {

                    const circleIndex = targetCommit.graphNodes.length - 1;

                    const parentIsOnTheLeft = parentCircleIndex < circleIndex;
                    const parentIsOnTheRight = parentCircleIndex > circleIndex;

                    let leftIndex = parentCircleIndex;
                    let rightIndex = circleIndex;

                    if (parentIsOnTheRight) {
                        leftIndex = circleIndex;
                        rightIndex = parentCircleIndex;
                    }

                    const hasMoreThanOneParent = nextCommit.parentHashes.length > 1;

                    if (hasMoreThanOneParent) {

                        // Check if parent has any commits above
                        let hasCommitAbove = false;
                        for (let commitAboveParentIndex = nextCommitIndex - 1; commitAboveParentIndex > targetCommitIndex; commitAboveParentIndex--) {
                            const commitAboveParent = commitsWithGraphNodes[commitAboveParentIndex];

                            if (commitAboveParent.parentHashes.includes(parentCommitHash)) {
                                hasCommitAbove = true;
                                break;
                            }
                        }

                        // Shortcut
                        if (!hasCommitAbove) {

                            // Left Index
                            commit.graphNodes[leftIndex].horizontalLineType = "RightHalf";

                            if (parentIsOnTheLeft)
                                commit.graphNodes[leftIndex].centerType = "RoundedCorner"

                            // Middle Indexes
                            for (let middleIndex = leftIndex + 1; middleIndex < rightIndex; middleIndex++) {
                                commit.graphNodes[middleIndex].horizontalLineType = "Full";
                                commit.graphNodes[middleIndex].centerType = "RoundedCorner";
                            }

                            // Right Index
                            commit.graphNodes[rightIndex].horizontalLineType = "LeftHalf"

                            if (parentIsOnTheRight)
                                commit.graphNodes[rightIndex].centerType = "RoundedCorner"

                            // Terminate search for parent
                            break;
                        }
                    }

                    if (parentIsOnTheLeft) {

                        // Add empty graph nodes (if missing)
                        while (rightIndex > nextCommit.graphNodes.length - 1)
                            nextCommit.graphNodes.push({ centerType: "None", verticalLineType: "None", horizontalLineType: "None" })

                        // Child on the right
                        nextCommit.graphNodes[rightIndex].centerType = "RoundedCorner";
                        nextCommit.graphNodes[rightIndex].verticalLineType = "TopHalf";
                    }

                    if (parentIsOnTheRight) {

                        // Child on the left
                        nextCommit.graphNodes[leftIndex].centerType = "RoundedCorner";
                        nextCommit.graphNodes[leftIndex].verticalLineType = "TopHalf";
                    }

                    // Left Index
                    nextCommit.graphNodes[leftIndex].horizontalLineType = "RightHalf";

                    // Middle Indexes
                    for (let middleIndex = leftIndex + 1; middleIndex < rightIndex; middleIndex++) {
                        nextCommit.graphNodes[middleIndex].centerType = "RoundedCorner";
                        nextCommit.graphNodes[middleIndex].horizontalLineType = "Full";
                    }

                    // Right Index
                    nextCommit.graphNodes[rightIndex].horizontalLineType = "LeftHalf";

                    // Terminate search for parent
                    break;
                }

                nextCommit.graphNodes.push({
                    centerType: "Circle",
                    verticalLineType: nextCommit.parentHashes.length > 0 ? "Full" : "TopHalf",
                    horizontalLineType: "None"
                })

                if (nextCommit.parentHashes.length === 0) {
                    // Terminate search for parent
                    break;
                }

                targetCommit = nextCommit;
                targetCommitIndex = nextCommitIndex;
                parentCommitHash = nextCommit.parentHashes[0];
            }
        }
    }

    return commitsWithGraphNodes;
}

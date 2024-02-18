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

    const allCommits: CommitWithGraphNodes[] = commits.map(commit => ({ ...commit, graphNodes: [] }));
    const connectedCommits = new Map<string, string[]>;

    for (let baseCommitIndex = 0; baseCommitIndex < allCommits.length; baseCommitIndex++) {

        const baseCommit = allCommits[baseCommitIndex];

        const commitHasCircle = doesCommitHaveCircle(baseCommitIndex);
        if (!commitHasCircle)
            drawCircle(baseCommitIndex);

        const hasNoParents = baseCommit.parentHashes.length === 0;
        if (hasNoParents)
            break;

        for (let baseParentIndex = 0; baseParentIndex < baseCommit.parentHashes.length; baseParentIndex++) {

            const baseParentHash = baseCommit.parentHashes[baseParentIndex];

            // Changes whenever a parent is found
            let targetParentCommitHash = baseParentHash;
            let targetChildCommitIndex = baseCommitIndex;

            for (let targetParentCommitIndex = baseCommitIndex + 1; targetParentCommitIndex < allCommits.length; targetParentCommitIndex++) {

                const targetParentCommit = allCommits[targetParentCommitIndex];

                const isParent = targetParentCommit.hash === targetParentCommitHash;
                if (!isParent) continue;

                const isAlreadyConnected = isConnected(targetChildCommitIndex, targetParentCommitIndex);
                if (isAlreadyConnected)
                    break;

                const parentCommitHasCircle = doesCommitHaveCircle(targetParentCommitIndex);
                if (!parentCommitHasCircle)
                    drawCircle(targetParentCommitIndex);

                drawLine(targetParentCommitIndex, targetChildCommitIndex);
                setConnected(targetChildCommitIndex, targetParentCommitIndex);

                const hasNoParents = targetParentCommit.parentHashes.length === 0;
                if (hasNoParents)
                    break;

                targetChildCommitIndex = targetParentCommitIndex;
                targetParentCommitHash = targetParentCommit.parentHashes[0]; // Search for first parent only
            }
        }
    }

    return allCommits;


    function doesCommitHaveCircle(commitIndex: number) {
        const commit = allCommits[commitIndex];
        const circleIndex = commit.graphNodes.findIndex(x => x.centerType === "Circle");
        return circleIndex !== -1;
    }

    function drawCircle(commitIndex: number) {
        const commit = allCommits[commitIndex];
        commit.graphNodes.push({
            centerType: "Circle",
            verticalLineType: "None",
            horizontalLineType: "None"
        })
    }

    function setConnected(childCommitIndex: number, parentCommitIndex: number) {

        const childCommit = allCommits[childCommitIndex];
        const parentCommit = allCommits[parentCommitIndex];

        let newConnectedCommits = connectedCommits.get(childCommit.hash);
        if (newConnectedCommits === undefined) {
            newConnectedCommits = [];
        }

        newConnectedCommits.push(parentCommit.hash);
        connectedCommits.set(childCommit.hash, newConnectedCommits);
    }

    function isConnected(childCommitIndex: number, parentCommitIndex: number): boolean {
        const childCommit = allCommits[childCommitIndex];
        const parentCommit = allCommits[parentCommitIndex];

        const existingConnectedCommits = connectedCommits.get(childCommit.hash);
        if (existingConnectedCommits === undefined)
            return false;

        return existingConnectedCommits.includes(parentCommit.hash);
    }

    function drawLine(bottomCommitIndex: number, topCommitIndex: number) {

        // Assumes that the two commits already have circles

        const bottomCommit = allCommits[bottomCommitIndex];
        const topCommit = allCommits[topCommitIndex];

        const bottomCommitCircleIndex = bottomCommit.graphNodes.findIndex(x => x.centerType === "Circle");
        const topCommitCircleIndex = topCommit.graphNodes.findIndex(x => x.centerType === "Circle");

        const isTopCommitDirectlyAbove = topCommitCircleIndex === bottomCommitCircleIndex;
        const isTopCommitToTheLeft = topCommitCircleIndex < bottomCommitCircleIndex;
        const isTopCommitToTheRight = topCommitCircleIndex > bottomCommitCircleIndex;

        if (isTopCommitDirectlyAbove)
            drawLineToCommitAbove();

        else if (isTopCommitToTheLeft)
            drawLineToCommitOnTopLeft();

        else if (isTopCommitToTheRight)
            drawLineToCommitOnTopRight();


        function drawLineToCommitAbove() {

            let haveCommitsBetween = false;
            for (let i = topCommitIndex + 1; i < bottomCommitIndex; i++) {
                const middleCommit = allCommits[i];

                const lastIndex = middleCommit.graphNodes.length - 1;
                if (topCommitCircleIndex > lastIndex)
                    continue;

                if (middleCommit.graphNodes[topCommitCircleIndex].centerType === "Circle") {
                    haveCommitsBetween = true;
                    break;
                }
            }

            // TODO : commits between handling

            if (!haveCommitsBetween) {
                const topVerticalType = topCommit.graphNodes[topCommitCircleIndex].verticalLineType;
                topCommit.graphNodes[topCommitCircleIndex].verticalLineType =
                    topVerticalType === "None"
                        ? "BottomHalf"
                        : "Full"

                const bottomVerticalType = bottomCommit.graphNodes[bottomCommitCircleIndex].verticalLineType;
                bottomCommit.graphNodes[bottomCommitCircleIndex].verticalLineType =
                    bottomVerticalType === "None"
                        ? "TopHalf"
                        : "Full"
            }

            // Draw Straight Line
            for (let i = topCommitIndex + 1; i < bottomCommitIndex; i++) {
                const middleCommit = allCommits[i];
                middleCommit.graphNodes.push({
                    centerType: "None",
                    verticalLineType: "Full",
                    horizontalLineType: "None",
                })
            }
        }

        function drawLineToCommitOnTopLeft() {

        }

        function drawLineToCommitOnTopRight() {

        }
    }
}

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

    function drawLine(bottomCommitIndex: number, topCommitIndex: number) {

        // Assumes that the two commits already have circles

        const bottomCommit = allCommits[bottomCommitIndex];
        const topCommit = allCommits[topCommitIndex];

        // console.log(`drawLine ${bottomCommit.hash} to ${topCommit.hash}`);

        const bottomCommitCircleIndex = bottomCommit.graphNodes.findIndex(x => x.centerType === "Circle");
        const topCommitCircleIndex = topCommit.graphNodes.findIndex(x => x.centerType === "Circle");

        const isTopCommitToTheRight = topCommitCircleIndex > bottomCommitCircleIndex;
        const isTopCommitToTheLeft = topCommitCircleIndex < bottomCommitCircleIndex;

        let isCurvingFromTheBottom = true;

        // ================================ Bottom Commit ================================

        if (isTopCommitToTheRight) {

            isCurvingFromTheBottom = bottomCommit.graphNodes.length < topCommit.graphNodes.length;
            if (isCurvingFromTheBottom) {

                // Modify Bottom Commit Horizontal Line
                const existingBottomCommitHorizontalLine = bottomCommit.graphNodes.slice(-1)[0].horizontalLineType;
                bottomCommit.graphNodes.slice(-1)[0].horizontalLineType =
                    existingBottomCommitHorizontalLine === "None"
                        ? "RightHalf"
                        : "Full"

                // Append Bottom Commit with new Graph Node
                bottomCommit.graphNodes.push({
                    centerType: "RoundedCorner",
                    verticalLineType: "TopHalf",
                    horizontalLineType: "LeftHalf",
                })
            }
        }

        else if (isTopCommitToTheLeft) {

            isCurvingFromTheBottom = bottomCommit.graphNodes.length > topCommit.graphNodes.length;
            if (isCurvingFromTheBottom) {

                // Modify Top Commit Horizontal Line
                const existingTopCommitHorizontalLine = topCommit.graphNodes.slice(-1)[0].horizontalLineType;
                topCommit.graphNodes.slice(-1)[0].horizontalLineType =
                    existingTopCommitHorizontalLine === "None"
                        ? "RightHalf"
                        : "Full"

                // Append Top Commit with new Graph Node
                topCommit.graphNodes.push({
                    centerType: "RoundedCorner",
                    verticalLineType: "BottomHalf",
                    horizontalLineType: "LeftHalf",
                })

                // Modify Bottom Commit Vertical Line
                const existingBottomCommitVerticalLine = bottomCommit.graphNodes.slice(-1)[0].verticalLineType;
                bottomCommit.graphNodes.slice(-1)[0].verticalLineType =
                    existingBottomCommitVerticalLine === "None"
                        ? "TopHalf"
                        : "Full"
            }
        }

        // TopCommit directly above BottomCommit
        else {

            // Modify Bottom Commit Vertical Line
            const existingBottomCommitVerticalLine = bottomCommit.graphNodes.slice(-1)[0].verticalLineType;
            bottomCommit.graphNodes.slice(-1)[0].verticalLineType =
                existingBottomCommitVerticalLine === "None"
                    ? "TopHalf"
                    : "Full"
        }

        // ================================ Middle Commits ================================

        // Modify Middle Commits Vertical Line

        for (let middleCommitIndex = bottomCommitIndex - 1; middleCommitIndex > topCommitIndex; middleCommitIndex--) {

            const middleCommit = allCommits[middleCommitIndex];

            const middleCommitHasLessGraphNodesThanBottomCommit = middleCommit.graphNodes.length < bottomCommit.graphNodes.length;
            if (middleCommitHasLessGraphNodesThanBottomCommit) {
                middleCommit.graphNodes.push({
                    centerType: "None",
                    verticalLineType: "Full",
                    horizontalLineType: "None",
                })
            }
        }

        // ================================ Top Commits ================================

        if (isTopCommitToTheRight) {

            if (isCurvingFromTheBottom) {

                // Modify Top Commit Vertical Line
                const existingTopCommitVerticalLine = topCommit.graphNodes.slice(-1)[0].verticalLineType;
                topCommit.graphNodes.slice(-1)[0].verticalLineType =
                    existingTopCommitVerticalLine === "None"
                        ? "BottomHalf"
                        : "Full"
            }

            // Curving from the top
            else {

                // Modify Top Commit Vertical Line
                topCommit.graphNodes.slice(-1)[0].verticalLineType = "BottomHalf";

                // Modify Top Commit Horizontal Line
                const existingTopCommitLeftHorizontalLine = topCommit.graphNodes.slice(-2)[0].horizontalLineType;
                topCommit.graphNodes.slice(-2)[0].centerType = "RoundedCorner";
                topCommit.graphNodes.slice(-2)[0].horizontalLineType =
                    existingTopCommitLeftHorizontalLine === "None"
                        ? "RightHalf"
                        : "Full"

                const existingTopCommitRightHorizontalLine = topCommit.graphNodes.slice(-1)[0].horizontalLineType;
                topCommit.graphNodes.slice(-1)[0].horizontalLineType =
                    existingTopCommitRightHorizontalLine === "None"
                        ? "LeftHalf"
                        : "Full"
            }
        }

        else if (isTopCommitToTheLeft) {

            if (isCurvingFromTheBottom) {
                // Do Nothing
            }

            // Curving from the top
            else {

                // Modify Top Commit Horizontal Line
                const existingTopCommitLeftHorizontalLine = topCommit.graphNodes[topCommitCircleIndex].horizontalLineType;
                topCommit.graphNodes[topCommitCircleIndex].horizontalLineType =
                    existingTopCommitLeftHorizontalLine === "None"
                        ? "RightHalf"
                        : "Full"

                const existingTopCommitRightHorizontalLine = topCommit.graphNodes[bottomCommitCircleIndex].horizontalLineType;
                topCommit.graphNodes[bottomCommitCircleIndex].horizontalLineType =
                    existingTopCommitRightHorizontalLine === "None"
                        ? "LeftHalf"
                        : "Full"
            }
        }

        else {

            // Modify Top Commit Vertical Line
            const existingTopCommitVerticalLine = topCommit.graphNodes.slice(-1)[0].verticalLineType;
            topCommit.graphNodes.slice(-1)[0].verticalLineType =
                existingTopCommitVerticalLine === "None"
                    ? "BottomHalf"
                    : "Full"
        }
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
}

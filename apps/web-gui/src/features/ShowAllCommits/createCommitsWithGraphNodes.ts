import type { AppRouterOutput } from "../../lib/trpc";
import { GraphNodeSettings } from "./GraphNode/GraphNode";

export type Commits = AppRouterOutput["getAllCommits"]
type Commit = Commits[0]

interface CommitWithGraphNodes extends Commit {
    graphNodes: GraphNodeSettings[]
}

export async function createCommitsWithGraphNodesAsync(commits: Commits): Promise<CommitWithGraphNodes[]> {

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

            const rightmostColumnIndex = getRightmostEmptyColumnIndex(topCommitCircleIndex, topCommitIndex, bottomCommitIndex);

            // Top Commit
            drawLineFromLeftToRight(topCommitIndex, topCommitCircleIndex, rightmostColumnIndex);
            setVerticalLineAsBottomHalfOrFull(topCommitIndex, rightmostColumnIndex);

            // Middle Commits
            drawVericalLineOnEmptyColumn(rightmostColumnIndex, topCommitIndex, bottomCommitIndex);

            // Bottom Commit
            drawLineFromLeftToRight(bottomCommitIndex, bottomCommitCircleIndex, rightmostColumnIndex);
            setVerticalLineAsTopHalfOrFull(bottomCommitIndex, rightmostColumnIndex);
        }

        function drawLineToCommitOnTopLeft() {

            const columnAboveBottomCommitIsEmpty = isColumnEmptyBetween(bottomCommitCircleIndex, topCommitIndex, bottomCommitIndex);
            if (columnAboveBottomCommitIsEmpty) {

                const rightmostColumnIndex = bottomCommitCircleIndex;

                // Top Commit
                drawLineFromLeftToRight(topCommitIndex, topCommitCircleIndex, rightmostColumnIndex);
                setVerticalLineAsBottomHalfOrFull(topCommitIndex, rightmostColumnIndex);

                // Middle Commits
                drawVericalLineOnEmptyColumn(rightmostColumnIndex, topCommitIndex, bottomCommitIndex);

                // Bottom Commit
                setVerticalLineAsTopHalfOrFull(bottomCommitIndex, rightmostColumnIndex);

                return;
            }

            const columnAboveBottomCommitHasNoCirclesBetween = !hasCirclesBetween(bottomCommitCircleIndex, topCommitIndex, bottomCommitIndex);
            if (columnAboveBottomCommitHasNoCirclesBetween) {

                const rightmostColumnIndex = bottomCommitCircleIndex;

                // Top Commit
                drawLineFromLeftToRight(topCommitIndex, topCommitCircleIndex, rightmostColumnIndex);

                return;
            }

            const rightmostColumnIndex = getRightmostEmptyColumnIndex(topCommitCircleIndex, topCommitIndex, bottomCommitIndex);

            // Top Commit
            drawLineFromLeftToRight(topCommitIndex, topCommitCircleIndex, rightmostColumnIndex);
            setVerticalLineAsBottomHalfOrFull(topCommitIndex, rightmostColumnIndex);

            // Middle Commits
            drawVericalLineOnEmptyColumn(rightmostColumnIndex, topCommitIndex, bottomCommitIndex);

            // Bottom Commit
            drawLineFromLeftToRight(bottomCommitIndex, bottomCommitCircleIndex, rightmostColumnIndex);
            setVerticalLineAsTopHalfOrFull(bottomCommitIndex, rightmostColumnIndex);
        }

        function drawLineToCommitOnTopRight() {

            const columnBelowTopCommitIsEmpty = isColumnEmptyIncludingBottom(topCommitCircleIndex, topCommitIndex, bottomCommitIndex);
            if (columnBelowTopCommitIsEmpty) {

                const rightmostColumnIndex = topCommitCircleIndex;

                // Top Commit
                setVerticalLineAsBottomHalfOrFull(topCommitIndex, rightmostColumnIndex);

                // Middle Commits
                drawVericalLineOnEmptyColumn(rightmostColumnIndex, topCommitIndex, bottomCommitIndex);

                // Bottom Commit
                drawLineFromLeftToRight(bottomCommitIndex, bottomCommitCircleIndex, rightmostColumnIndex);
                setVerticalLineAsTopHalfOrFull(bottomCommitIndex, rightmostColumnIndex);

                return;
            }

            const columnAboveBottomCommitHasNoCirclesBetween = !hasCirclesBetween(bottomCommitCircleIndex, topCommitIndex, bottomCommitIndex);
            if (columnAboveBottomCommitHasNoCirclesBetween) {

                topCommit.graphNodes[bottomCommitCircleIndex].centerType = "RoundedCorner"
                drawLineFromLeftToRight(topCommitIndex, bottomCommitCircleIndex, topCommitCircleIndex);

                return
            }

            const rightmostColumnIndex = getRightmostEmptyColumnIndex(topCommitCircleIndex, topCommitIndex, bottomCommitIndex);

            // Top Commit
            drawLineFromLeftToRight(topCommitIndex, topCommitCircleIndex, rightmostColumnIndex);
            setVerticalLineAsBottomHalfOrFull(topCommitIndex, rightmostColumnIndex);

            // Middle Commits
            drawVericalLineOnEmptyColumn(rightmostColumnIndex, topCommitIndex, bottomCommitIndex);

            // Bottom Commit
            drawLineFromLeftToRight(bottomCommitIndex, bottomCommitCircleIndex, rightmostColumnIndex);
            setVerticalLineAsTopHalfOrFull(bottomCommitIndex, rightmostColumnIndex);
        }
    }

    // Utility Functions
    function drawLineFromLeftToRight(commitIndex: number, leftmostColumnIndex: number, rightmostColumnIndex: number) {

        if (rightmostColumnIndex <= leftmostColumnIndex)
            return;

        const commit = allCommits[commitIndex];
        const leftmostGraphNode = commit.graphNodes[leftmostColumnIndex];

        // Left
        const existingType = leftmostGraphNode.horizontalLineType;
        leftmostGraphNode.horizontalLineType =
            ((existingType === "None") || (existingType === "RightHalf"))
                ? "RightHalf"
                : "Full"

        // Draw until the right
        for (let columnIndex = leftmostColumnIndex + 1; columnIndex <= rightmostColumnIndex; columnIndex++) {

            addEmptyGraphNodesUntilColumnIndex(commitIndex, columnIndex);

            const graphNode = commit.graphNodes[columnIndex];

            const existingCenterType = graphNode.centerType;
            if (existingCenterType === "None")
                graphNode.centerType = "RoundedCorner";

            if (columnIndex !== rightmostColumnIndex)
                graphNode.horizontalLineType = "Full";

            const existingType = graphNode.horizontalLineType;
            graphNode.horizontalLineType =
                ((existingType === "None") || (existingType === "LeftHalf"))
                    ? "LeftHalf"
                    : "Full"
        }
    }

    function drawVericalLineOnEmptyColumn(columnIndex: number, topCommitIndex: number, bottomCommitIndex: number) {
        for (let middleCommitIndex = topCommitIndex + 1; middleCommitIndex < bottomCommitIndex; middleCommitIndex++) {
            const middleCommit = allCommits[middleCommitIndex];

            addEmptyGraphNodesUntilColumnIndex(middleCommitIndex, columnIndex);

            const graphNode = middleCommit.graphNodes[columnIndex];
            graphNode.verticalLineType = "Full";
        }
    }

    function setVerticalLineAsTopHalfOrFull(commitIndex: number, columnIndex: number) {
        const commit = allCommits[commitIndex];

        addEmptyGraphNodesUntilColumnIndex(commitIndex, columnIndex);
        const graphNode = commit.graphNodes[columnIndex];

        const existingType = graphNode.verticalLineType;
        graphNode.verticalLineType =
            ((existingType === "None") || (existingType === "TopHalf"))
                ? "TopHalf"
                : "Full"
    }

    function setVerticalLineAsBottomHalfOrFull(commitIndex: number, columnIndex: number) {
        const commit = allCommits[commitIndex];

        addEmptyGraphNodesUntilColumnIndex(commitIndex, columnIndex);
        const graphNode = commit.graphNodes[columnIndex];

        const existingType = graphNode.verticalLineType;
        graphNode.verticalLineType =
            ((existingType === "None") || (existingType === "BottomHalf"))
                ? "BottomHalf"
                : "Full"
    }

    function addEmptyGraphNodesUntilColumnIndex(commitIndex: number, columnIndex: number) {
        const commit = allCommits[commitIndex];

        while (columnIndex > commit.graphNodes.length - 1) {
            commit.graphNodes.push({
                centerType: "None",
                verticalLineType: "None",
                horizontalLineType: "None",
            })
        }
    }

    function getRightmostEmptyColumnIndex(startingLeftIndex: number, topCommitIndex: number, bottomCommitIndex: number) {
        let columnIndex = startingLeftIndex;

        while (true) {
            if (isColumnEmptyBetween(columnIndex, topCommitIndex, bottomCommitIndex))
                break;

            columnIndex++;
        }

        return columnIndex;
    }

    function isColumnEmptyBetween(columnIndex: number, topCommitIndex: number, bottomCommitIndex: number) {

        for (let commitIndex = topCommitIndex + 1; commitIndex < bottomCommitIndex; commitIndex++) {

            const middleCommit = allCommits[commitIndex];

            const lastIndex = middleCommit.graphNodes.length - 1;

            if (columnIndex <= lastIndex)
                return false
        }

        return true;
    }

    function isColumnEmptyIncludingBottom(columnIndex: number, topCommitIndex: number, bottomCommitIndex: number) {

        for (let commitIndex = topCommitIndex + 1; commitIndex <= bottomCommitIndex; commitIndex++) {

            const middleCommit = allCommits[commitIndex];

            const lastIndex = middleCommit.graphNodes.length - 1;

            if (columnIndex <= lastIndex)
                return false
        }

        return true;
    }

    function hasCirclesBetween(columnIndex: number, topCommitIndex: number, bottomCommitIndex: number) {

        for (let commitIndex = topCommitIndex + 1; commitIndex < bottomCommitIndex; commitIndex++) {

            const middleCommit = allCommits[commitIndex];

            const lastIndex = middleCommit.graphNodes.length - 1;
            if (columnIndex > lastIndex)
                continue;

            if (middleCommit.graphNodes[columnIndex].centerType === "Circle")
                return true;
        }

        return false;
    }
}

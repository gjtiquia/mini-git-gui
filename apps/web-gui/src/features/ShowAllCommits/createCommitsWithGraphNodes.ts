import type { AppRouterOutput } from "../../lib/trpc";
import { GraphNodeSettings } from "./GraphNode/GraphNode";
import { VerticalLineType } from "./GraphNode/VerticalLineElement";

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

    return commits.map((commit, index, array) => {

        const graphNodes: GraphNodeSettings[] = [];

        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        const isFirstOrLast = isFirst || isLast;

        const defaultVerticalLine: VerticalLineType =
            isFirst ? "BottomHalf"
                : isLast ? "TopHalf"
                    : "Full";

        const isEven = index % 2 === 0;
        if (isEven) {
            graphNodes.push({
                centerType: "Circle",
                verticalLineType: defaultVerticalLine,
                horizontalLineType: isFirst ? "None" : "RightHalf",
            });

            if (!isFirst)
                graphNodes.push({
                    centerType: "RoundedCorner",
                    verticalLineType: "TopHalf",
                    horizontalLineType: "LeftHalf",
                });
        }
        else {
            graphNodes.push({
                centerType: isFirstOrLast ? "Circle" : "None",
                verticalLineType: defaultVerticalLine,
                horizontalLineType: "None",
            });

            if (!isFirstOrLast)
                graphNodes.push({
                    centerType: "Circle",
                    verticalLineType: "BottomHalf",
                    horizontalLineType: "None",
                });
        }

        return {
            ...commit,
            graphNodes
        };
    });
}

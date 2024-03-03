import type { File, FileDiff, LineDiff } from "./types";

/*
Ref: https://git-scm.com/docs/git-diff

option --word-diff=porcelain
- basically splits the line into tokens
- uses ~ to represent newline
- prefix "+" => added
- prefix "-" => removed
- prefix " " => unchanged
*/

export function parseLineDiffs(rawData: string) {

    const parsedLines = rawData
        .split("\n")
        // Remove headers
        .filter(x => x.substring(0, 4) !== "diff")
        .filter(x => x.substring(0, 5) !== "index")
        .filter(x => x.substring(0, 3) !== "---")
        .filter(x => x.substring(0, 3) !== "+++");

    // console.log(parsedLines);
    const partialLineDiffs: LineDiff[] = [[]];
    parsedLines.forEach(line => {
        const lastLineDiff = partialLineDiffs[partialLineDiffs.length - 1];

        if (line.substring(0, 2) === "@@") {
            lastLineDiff.push({ tokenType: "Gray", line });
            partialLineDiffs.push([]);
            return;
        }

        const firstChar = line.substring(0, 1);
        if (firstChar === "~") {
            partialLineDiffs.push([]);
            return;
        }

        if (firstChar === " ") {
            lastLineDiff.push({ tokenType: "Unchanged", line: line.substring(1) });
            return;
        }

        if (firstChar === "+") {
            lastLineDiff.push({ tokenType: "Added", line: line.substring(1) });
            return;
        }

        if (firstChar === "-") {
            lastLineDiff.push({ tokenType: "Removed", line: line.substring(1) });
            return;
        }
    });

    return partialLineDiffs;
}
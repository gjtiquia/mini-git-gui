import { Button } from "@/components/ui/button";
import { selectedFilesAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { useState } from "react";

export function DiffStack() {

    const selectedFiles = useAtomValue(selectedFilesAtom);

    const minIndex = 0;
    const maxIndex = selectedFiles.length - 1;
    const [currentFileIndex, setCurrentFileIndex] = useState(minIndex);

    const currentFile = selectedFiles[currentFileIndex];
    const isFirst = currentFileIndex == minIndex;
    const isLast = currentFileIndex == maxIndex;

    function showNextFile() {
        const nextIndex = clamp(currentFileIndex + 1, minIndex, maxIndex);
        setCurrentFileIndex(nextIndex);
    }

    function showPreviousFile() {
        const previousIndex = clamp(currentFileIndex - 1, minIndex, maxIndex);
        setCurrentFileIndex(previousIndex);
    }

    function clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    return (
        <div className="p-2 flex-grow min-h-0 flex flex-col gap-2">
            <div className="whitespace-nowrap">
                <div className="flex gap-2">
                    <p>File Name:</p>
                    <p className="flex-grow min-w-0 overflow-x-auto">{currentFile.name}</p>
                </div>
                <div className="flex gap-2">
                    <p>File Path:</p>
                    <p className="flex-grow min-w-0 overflow-x-auto">{currentFile.path}</p>
                </div>
            </div>

            <div className="flex-grow min-h-0 border rounded-md p-2">
                <p>TODO: Get File Diff From Git</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant={"outline"}
                    disabled={isFirst}
                    onClick={showPreviousFile}
                >
                    Previous File
                </Button>

                <Button
                    variant={"outline"}
                    disabled={isLast}
                    onClick={showNextFile}
                >
                    Next File
                </Button>
            </div>
        </div>
    );
}

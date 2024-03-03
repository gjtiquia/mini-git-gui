import { Button } from "@/components/ui/button";
import { selectedFilesAtom } from "@/lib/atoms";
import { AppRouterOutput, trpc } from "@/lib/trpc";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { File } from "./types";

export function DiffStack() {

    const { fileType, selectedFiles } = useAtomValue(selectedFilesAtom);

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
                <div className="flex gap-2">
                    <p>File Status:</p>
                    <p className="flex-grow min-w-0 overflow-x-auto">{currentFile.status}</p>
                </div>
            </div>

            <div className="flex-grow min-h-0 border rounded-md p-2 overflow-auto">
                {fileType === "Unstaged"
                    ? <UnstagedFileChangesView file={currentFile} />
                    : <StagedFileChangesView file={currentFile} />
                }
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

function UnstagedFileChangesView(props: { file: File }) {

    const fileChangesQuery = trpc.getUnstagedFileChanges.useQuery({ file: props.file })

    if (fileChangesQuery.isPending || fileChangesQuery.isFetching)
        return <p>Loading file changes...</p>

    if (fileChangesQuery.error)
        return <p className="text-red-500">{fileChangesQuery.error.message}</p>

    return (
        <>
            {fileChangesQuery.data.lines.map((line, index) => {
                return (
                    <code key={index} className="block whitespace-pre text-xs">
                        {line.map((token, index) => {
                            return (
                                <TokenSpan key={index} token={token} />
                            )
                        })}
                    </code>
                )
            })}
        </>
    )
}

function StagedFileChangesView(props: { file: File }) {

    const fileChangesQuery = trpc.getStagedFileChanges.useQuery({ file: props.file })

    if (fileChangesQuery.isPending || fileChangesQuery.isFetching)
        return <p>Loading file changes...</p>

    if (fileChangesQuery.error)
        return <p className="text-red-500">{fileChangesQuery.error.message}</p>

    return (
        <>
            {fileChangesQuery.data.lines.map((line, index) => {
                return (
                    <code key={index} className="block whitespace-pre text-xs">
                        {line.map((token, index) => {
                            return (
                                <TokenSpan key={index} token={token} />
                            )
                        })}
                    </code>
                )
            })}
        </>
    )
}

type Token = AppRouterOutput["getUnstagedFileChanges"]["lines"][0][0]

function TokenSpan(props: { token: Token }) {
    if (props.token.tokenType === "Added")
        return <GreenSpan>{props.token.line}</GreenSpan>

    if (props.token.tokenType === "Removed")
        return <RedSpan>{props.token.line}</RedSpan>

    if (props.token.tokenType === "Unchanged")
        return <UnchangedSpan>{props.token.line}</UnchangedSpan>

    if (props.token.tokenType === "Gray")
        return <GraySpan>{props.token.line}</GraySpan>
}

function UnchangedSpan(props: { children: React.ReactNode }) {
    return <span>{props.children}</span>
}

function RedSpan(props: { children: React.ReactNode }) {
    return <span className="bg-red-500/50">{props.children}</span>
}

function GreenSpan(props: { children: React.ReactNode }) {
    return <span className="bg-green-500/50">{props.children}</span>
}

function GraySpan(props: { children: React.ReactNode }) {
    return <span className="text-gray-500">{props.children}</span>
}
import { Button } from "@/components/ui/button";
import { AppRouterOutput, trpc } from "@/lib/trpc";
import { useCheckboxState } from "./useCheckboxState";
import { FilesTable } from "./FilesTable";
import { CommitDialog } from "./CommitDialog";
import { useState } from "react";

type StagedFile = AppRouterOutput["getStatus"]["stagedFiles"][0];

export function StagedView(props: { stagedFiles: StagedFile[] }) {

    const stagedFiles = props.stagedFiles;

    if (stagedFiles.length === 0)
        return (
            <div className="flex items-center justify-center">
                <p>No staged files</p>
            </div>
        )

    return <StagedFilesTable files={stagedFiles} />
}

function StagedFilesTable(props: { files: StagedFile[] }) {

    const files = props.files;
    const [isCommitDialogOpen, setCommitDialogOpen] = useState(false);

    const utils = trpc.useUtils();

    const unstageFilesMutation = trpc.unstageFiles.useMutation({
        onSettled: () => utils.invalidate()
    });

    const checkboxState = useCheckboxState(files.length);

    function onUnstageClicked() {
        if (!checkboxState.hasMoreThanOneFileSelected)
            return;

        const filePathsToUnstage = files
            .filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index))
            .map(x => x.path)

        unstageFilesMutation.mutate({ filePaths: filePathsToUnstage })
    }

    function onCommitClicked() {
        if (!checkboxState.hasMoreThanOneFileSelected)
            return;

        setCommitDialogOpen(true);
    }

    function onCommitFromDialogClicked() {
        setCommitDialogOpen(false);

        const filePathsToCommit = files
            .filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index))
            .map(x => x.path)

        // TODO
        // unstageFilesMutation.mutate({ filePaths: filePathsToStage })
    }

    return (
        <div className="flex-grow min-h-0 flex flex-col gap-2">
            <FilesTable files={files} checkboxState={checkboxState} />

            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={"secondary"}
                    onClick={() => onUnstageClicked()}
                    disabled={!checkboxState.hasMoreThanOneFileSelected()}
                >
                    Unstage
                </Button>

                <Button
                    className="col-span-2"
                    onClick={() => onCommitClicked()}
                    disabled={!checkboxState.hasMoreThanOneFileSelected()}
                >
                    Commit
                </Button>
            </div>

            <CommitDialog
                isOpen={isCommitDialogOpen}
                onOpenChange={setCommitDialogOpen}
                onCommitClicked={() => onCommitFromDialogClicked()}
            />
        </div>
    );
}

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

    const commitFilesMutation = trpc.commitFiles.useMutation({
        onSettled: () => utils.invalidate()
    });

    const checkboxState = useCheckboxState(files.length);

    function onUnstageClicked() {
        if (!checkboxState.hasAtLeastOneCheckboxChecked)
            return;

        const filePathsToUnstage = files
            .filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index))
            .map(x => x.path)

        unstageFilesMutation.mutate({ filePaths: filePathsToUnstage })
    }

    function canClickCommit() {
        // At least one but not all selected
        // => implies that commit is commiting ALL
        if (checkboxState.hasAtLeastOneCheckboxChecked() && !checkboxState.isAllCheckboxesChecked())
            return false;

        // Zero selected or all selected
        return true;
    }

    function onCommitClicked() {
        if (!canClickCommit())
            return;

        setCommitDialogOpen(true);
    }

    function onCommitFromDialogClicked(commitInput: { message: string, description?: string }) {
        setCommitDialogOpen(false);

        commitFilesMutation.mutate({
            message: commitInput.message,
            description: commitInput.description
        })
    }

    return (
        <div className="flex-grow min-h-0 flex flex-col gap-2">
            <FilesTable files={files} checkboxState={checkboxState} />

            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={"secondary"}
                    onClick={() => onUnstageClicked()}
                    disabled={!checkboxState.hasAtLeastOneCheckboxChecked()}
                >
                    Unstage
                </Button>

                <Button
                    className="col-span-2"
                    onClick={() => onCommitClicked()}
                    disabled={!canClickCommit()}
                >
                    Commit All Staged Files
                </Button>
            </div>

            <CommitDialog
                isOpen={isCommitDialogOpen}
                onOpenChange={setCommitDialogOpen}
                onCommitClicked={(commitInput) => onCommitFromDialogClicked(commitInput)}
            />
        </div>
    );
}

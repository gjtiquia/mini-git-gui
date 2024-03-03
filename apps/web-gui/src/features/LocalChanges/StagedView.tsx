import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useCheckboxState } from "./useCheckboxState";
import { FilesTable } from "./FilesTable";
import { CommitDialog } from "./CommitDialog";
import { useState } from "react";
import type { StagedFile } from "./types"
import { OptionsButton } from "./OptionsButton";

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

    function getSelectedFiles() {
        return files.filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index));
    }

    function onUnstageClicked() {
        if (!checkboxState.hasAtLeastOneCheckboxChecked)
            return;

        const filesToUnstage = files
            .filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index))

        unstageFilesMutation.mutate({ files: filesToUnstage })
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

            <div className="flex gap-2">
                <OptionsButton
                    selectedFiles={{ fileType: "Staged", selectedFiles: getSelectedFiles() }}
                    disabled={!checkboxState.hasAtLeastOneCheckboxChecked()}
                />

                <div className="flex-grow grid grid-cols-3 gap-2">
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
            </div>

            <CommitDialog
                isOpen={isCommitDialogOpen}
                onOpenChange={setCommitDialogOpen}
                onCommitClicked={(commitInput) => onCommitFromDialogClicked(commitInput)}
            />
        </div>
    );
}

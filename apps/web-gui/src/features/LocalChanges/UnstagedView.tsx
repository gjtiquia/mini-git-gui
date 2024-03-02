import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useCheckboxState } from "./useCheckboxState";
import { FilesTable } from "./FilesTable";
import { DiscardAlertDialog } from "./DiscardAlertDialog";
import { OptionsButton } from "./OptionsButton";
import type { UnstagedFile } from "./types"

export function UnstagedView(props: { unstagedFiles: UnstagedFile[] }) {

    const unstagedFiles = props.unstagedFiles;
    // const unstagedFiles = dummyUnstagedFiles;
    // const unstagedFiles = [] as UnstagedFile[];

    if (unstagedFiles.length === 0)
        return (
            <div className="flex items-center justify-center">
                <p>No unstaged files</p>
            </div>
        )

    return <UnstagedFilesTable files={unstagedFiles} />
}

export function UnstagedFilesTable(props: { files: UnstagedFile[] }) {

    const files = props.files;

    const utils = trpc.useUtils();

    const discardFilesMutation = trpc.discardFiles.useMutation({
        onSettled: () => utils.invalidate()
    });

    const stageFilesMutation = trpc.stageFiles.useMutation({
        onSettled: () => utils.invalidate()
    });

    const checkboxState = useCheckboxState(files.length);

    function getSelectedFiles() {
        return files.filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index));
    }

    function onDiscardClicked() {
        if (!checkboxState.hasAtLeastOneCheckboxChecked)
            return;

        const filesToDiscard = getSelectedFiles();

        discardFilesMutation.mutate({ files: filesToDiscard })
    }

    function onStageClicked() {
        if (!checkboxState.hasAtLeastOneCheckboxChecked)
            return;

        const filePathsToStage = getSelectedFiles().map(x => x.path)

        stageFilesMutation.mutate({ filePaths: filePathsToStage })
    }

    return (
        <div className="flex-grow min-h-0 flex flex-col gap-2">
            <FilesTable files={files} checkboxState={checkboxState} />

            <div className="flex gap-2">
                <OptionsButton
                    selectedFiles={getSelectedFiles()}
                    disabled={!checkboxState.hasAtLeastOneCheckboxChecked()}
                />

                <div className="flex-grow grid grid-cols-3 gap-2">
                    <DiscardAlertDialog
                        onActionClicked={() => onDiscardClicked()}
                        disabled={!checkboxState.hasAtLeastOneCheckboxChecked()}
                    />

                    <Button
                        className="col-span-2"
                        onClick={() => onStageClicked()}
                        disabled={!checkboxState.hasAtLeastOneCheckboxChecked()}
                    >
                        Stage
                    </Button>
                </div>
            </div>
        </div>
    );
}

const dummyUnstagedFiles: UnstagedFile[] = [];
for (let i = 0; i < 16; i++) {
    dummyUnstagedFiles.push({
        statusCode: "M",
        status: "modified",
        path: "/a/really/super-super/duper/long/path/that/is/actually/like/really/long.jpg",
        name: "long.jpg"
    })
}

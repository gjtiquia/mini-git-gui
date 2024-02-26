import { Button } from "@/components/ui/button";
import { AppRouterOutput, trpc } from "@/lib/trpc";
import { useCheckboxState } from "./useCheckboxState";
import { FilesTable } from "./FilesTable";

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

    // TODO
    // const utils = trpc.useUtils();
    // const stageFilesMutation = trpc.stageFiles.useMutation({
    //     onSettled: () => utils.invalidate()
    // });

    const checkboxState = useCheckboxState(files.length);

    function onCommitClicked() {
        if (!checkboxState.hasMoreThanOneFileSelected)
            return;

        const filePathsToCommit = files
            .filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index))
            .map(x => x.path)

        // TODO
        // stageFilesMutation.mutate({ filePaths: filePathsToStage })
    }

    return (
        <div className="flex-grow min-h-0 flex flex-col gap-2">
            <FilesTable files={files} checkboxState={checkboxState} />

            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={"secondary"}
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
        </div>
    );
}

import { Button } from "@/components/ui/button";
import { AppRouterOutput, trpc } from "@/lib/trpc";
import { useCheckboxState } from "./useCheckboxState";
import { FilesTable } from "./FilesTable";

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0];

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
    const stageFilesMutation = trpc.stageFiles.useMutation({
        onSettled: () => utils.invalidate()
    });

    const checkboxState = useCheckboxState(files.length);

    function onStageClicked() {
        if (!checkboxState.hasMoreThanOneFileSelected)
            return;

        const filePathsToStage = files
            .filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index))
            .map(x => x.path)

        stageFilesMutation.mutate({ filePaths: filePathsToStage })
    }

    return (
        <div className="flex-grow min-h-0 flex flex-col gap-2">
            <FilesTable files={files} checkboxState={checkboxState} />

            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={"destructive"}
                    disabled={!checkboxState.hasMoreThanOneFileSelected()}
                >
                    Discard
                </Button>

                <Button
                    className="col-span-2"
                    onClick={() => onStageClicked()}
                    disabled={!checkboxState.hasMoreThanOneFileSelected()}
                >
                    Stage
                </Button>
            </div>
        </div>
    );
}

const dummyUnstagedFiles: UnstagedFile[] = [];
for (let i = 0; i < 16; i++) {
    dummyUnstagedFiles.push({
        statusCode: "M",
        status: "modified",
        path: "/a/really/super-super/duper/long/path/that/is/actually/like/really/long.jpg"
    })
}

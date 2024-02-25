import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AppRouterOutput, trpc } from "@/lib/trpc";
import { useCheckboxState } from "./useCheckboxState";

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0];
type StagedFile = AppRouterOutput["getStatus"]["stagedFiles"][0];
type File = UnstagedFile | StagedFile;

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

    return <FilesTable files={unstagedFiles} />
}

export function FilesTable(props: { files: File[] }) {

    const files = props.files;

    const utils = trpc.useUtils();
    const stageFilesMutation = trpc.stageFiles.useMutation({
        onSettled: () => utils.invalidate()
    });

    const checkboxState = useCheckboxState(files.length);

    const hasMoreThanOneFileSelected = checkboxState.checkedCheckboxIndexes.length > 0;

    function onStageClicked() {
        if (!hasMoreThanOneFileSelected)
            return;

        const filePathsToStage = files
            .filter((_, index) => checkboxState.checkedCheckboxIndexes.includes(index))
            .map(x => x.path)

        stageFilesMutation.mutate({ filePaths: filePathsToStage })
    }

    return (
        <div className="flex-grow min-h-0 flex flex-col gap-2">
            <div className="flex-grow min-h-0 flex flex-col border rounded-md overflow-y-auto">
                <div className="flex-grow min-h-0 p-2 overflow-auto">

                    {/* // TODO : Show "No Unstaged Files" if file count is 0 */}

                    {/* https://stackoverflow.com/questions/33746041/child-element-100-width-of-its-parent-with-overflow-scroll/39612912#39612912 */}
                    {/* Inline block => separator stretch with contents     */}
                    {/* min-w-full   => separator min width == parent width */}
                    <div className="inline-block min-w-full space-y-2 whitespace-nowrap">

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="unstaged-files-select-all"
                                checked={checkboxState.isAllCheckboxesChecked()}
                                onCheckedChange={() => checkboxState.onSelectAllCheckboxes()}
                            />
                            <Label htmlFor="unstaged-files-select-all">Select All</Label>
                        </div>

                        <Separator />

                        {files.map((file, fileIndex) => {

                            const checkboxId = "file-" + fileIndex;

                            return (
                                <div key={fileIndex} className="flex items-center gap-3">
                                    <Checkbox
                                        id={checkboxId}
                                        checked={checkboxState.isCheckboxChecked(fileIndex)}
                                        onCheckedChange={() => checkboxState.onCheckboxCheckedChanged(fileIndex)}
                                    />
                                    <div className="flex items-center gap-3">
                                        <p className="font-mono">{file.statusCode}</p>
                                        <Label htmlFor={checkboxId}>{file.path}</Label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={"destructive"}
                    disabled={!hasMoreThanOneFileSelected}
                >
                    Discard
                </Button>

                <Button
                    className="col-span-2"
                    onClick={() => onStageClicked()}
                    disabled={!hasMoreThanOneFileSelected}
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
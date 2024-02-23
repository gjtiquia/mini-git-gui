import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AppRouterOutput } from "@/lib/trpc";
import { useCheckboxState } from "./useCheckboxState";

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0]

export function UnstagedView(props: { unstagedFiles: UnstagedFile[] }) {

    // const unstagedFiles = props.unstagedFiles;
    const unstagedFiles = dummyUnstagedFiles;
    // const unstagedFiles = [] as UnstagedFile[];

    const checkboxState = useCheckboxState(unstagedFiles.length);

    return (
        <div className="flex-grow min-h-0 flex flex-col gap-2">
            <div className="flex-grow min-h-0 flex flex-col border rounded-md">
                <div className="pt-2 flex-grow min-h-0 flex overflow-x-auto">

                    {/* // TODO : Show "No Unstaged Files" if file count is 0 */}

                    <div className="flex-grow min-w-0 flex flex-col gap-2 overflow-x-auto">

                        <div className="px-2 flex items-center gap-3">
                            <Checkbox
                                id="unstaged-files-select-all"
                                checked={checkboxState.isAllCheckboxesChecked()}
                                onCheckedChange={() => checkboxState.onSelectAllCheckboxes()}
                            />

                            {/* <Label htmlFor="unstaged-files-select-all">Select All</Label> */}
                            <p className="whitespace-nowrap">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa eaque consectetur, ea dolorem modi natus omnis voluptatum deserunt at quisquam.</p>
                        </div>

                        <Separator />

                        <div className="flex-grow min-h-0 overflow-y-auto px-2 pb-2 flex flex-col gap-2 whitespace-nowrap">
                            {unstagedFiles.map((file, fileIndex) => {

                                const isChecked = checkboxState.isCheckboxChecked(fileIndex);
                                const checkboxId = "file-" + fileIndex;

                                return (
                                    <div key={fileIndex} className="flex items-center gap-3">
                                        <Checkbox
                                            id={checkboxId}
                                            checked={isChecked}
                                            onCheckedChange={() => checkboxState.onCheckboxCheckedChanged(fileIndex)}
                                        />
                                        <div className="flex items-center gap-3">
                                            <p className="font-mono">{file.statusCode}</p>
                                            <Label
                                                htmlFor={checkboxId}
                                                className={isChecked ? "" : "font-normal"}
                                            >
                                                {file.path}
                                            </Label>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-3 gap-2">
                <Button variant={"destructive"}>
                    Discard
                </Button>
                <Button className="col-span-2">
                    Stage
                </Button>
            </div>
        </div>
    );
}

const dummyUnstagedFiles: UnstagedFile[] = [];
for (let i = 0; i < 1; i++) {
    dummyUnstagedFiles.push({
        statusCode: "M",
        status: "modified",
        path: "/a/really/super-super/duper/long/path/that/is/actually/like/really/long.jpg"
    })
}
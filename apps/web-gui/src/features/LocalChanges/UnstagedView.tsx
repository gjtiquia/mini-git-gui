import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AppRouterOutput } from "@/lib/trpc";
import { useState } from "react";

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0]

export function UnstagedView(props: { unstagedFiles: UnstagedFile[] }) {

    const [checkedFileIndexes, setCheckedFileIndexes] = useState<number[]>([]);

    const unstagedFiles = props.unstagedFiles;
    // const unstagedFiles = dummyUnstagedFiles;

    function onFileCheckedChanged(fileIndex: number) {
        setCheckedFileIndexes(previousArray => {
            const newArray = [...previousArray]

            if (!newArray.includes(fileIndex)) {
                newArray.push(fileIndex);
            }
            else {
                const existingIndex = newArray.indexOf(fileIndex);
                newArray.splice(existingIndex, 1);
            }

            return newArray;
        })
    }

    function isAllSelected() {
        for (let i = 0; i < unstagedFiles.length; i++) {
            if (!checkedFileIndexes.includes(i))
                return false;
        }

        return true;
    }

    function onSelectAll() {
        if (isAllSelected())
            setCheckedFileIndexes([])
        else
            setCheckedFileIndexes(unstagedFiles.map((_, fileIndex) => fileIndex))
    }

    return (
        <div className="flex-grow flex flex-col gap-2">
            <div className="flex-grow border rounded-md p-2">
                <div className="h-full overflow-x-auto">

                    {/* // TODO : Show "No Unstaged Files" if file count is 0 */}

                    {/* https://stackoverflow.com/questions/33746041/child-element-100-width-of-its-parent-with-overflow-scroll/39612912#39612912 */}
                    {/* Inline block => separator stretch with contents     */}
                    {/* min-w-full   => separator min width == parent width */}
                    <div className="inline-block min-w-full space-y-2 whitespace-nowrap">

                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={isAllSelected()}
                                onCheckedChange={() => onSelectAll()}
                            />
                            <p>Select All</p>
                        </div>

                        <Separator />

                        {unstagedFiles.map((file, fileIndex) => {

                            const isChecked = checkedFileIndexes.includes(fileIndex);

                            return (
                                <div key={fileIndex} className="flex items-center gap-3">
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => onFileCheckedChanged(fileIndex)}
                                    />
                                    <div className="flex gap-3">
                                        <p className="font-mono">{file.statusCode}</p>
                                        <p>{file.path}</p>
                                    </div>
                                </div>
                            )
                        })}
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
for (let i = 0; i < 10; i++) {
    dummyUnstagedFiles.push({
        statusCode: "M",
        status: "modified",
        path: "/a/really/super-super/duper/long/path/that/is/actually/like/really/long.jpg"
    })
}
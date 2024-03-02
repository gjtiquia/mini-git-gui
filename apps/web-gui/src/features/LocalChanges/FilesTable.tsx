import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCheckboxState } from "./useCheckboxState";
import type { File } from "./types"

type CheckboxState = ReturnType<typeof useCheckboxState>;

export function FilesTable(props: { files: File[]; checkboxState: CheckboxState; }) {

    const files = props.files;
    const checkboxState = props.checkboxState;

    return (
        <div className="flex-grow min-h-0 flex flex-col border rounded-md overflow-y-auto">
            <div className="flex-grow min-h-0 p-2 overflow-auto">

                {/* https://stackoverflow.com/questions/33746041/child-element-100-width-of-its-parent-with-overflow-scroll/39612912#39612912 */}
                {/* Inline block => separator stretch with contents     */}
                {/* min-w-full   => separator min width == parent width */}
                <div className="inline-block min-w-full space-y-2 whitespace-nowrap">

                    <div className="flex items-center gap-3">
                        <Checkbox id="select-all"
                            checked={checkboxState.isAllCheckboxesChecked()}
                            onCheckedChange={() => checkboxState.onSelectAllCheckboxes()} />
                        <Label htmlFor="select-all">Select All</Label>
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
                                    <Label htmlFor={checkboxId}>{file.name}</Label>
                                    <Label htmlFor={checkboxId}>{file.formattedPath}</Label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

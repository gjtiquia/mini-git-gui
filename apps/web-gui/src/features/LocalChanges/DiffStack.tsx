import { selectedFilesAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";

// TODO : Header showing title "Diff"/"File Changes" (Belongs in the StackHeader component)

// TODO : Sub Header for file name
// TODO : scrollable vertical screen showing
// TODO : Footer arrow buttons for seeing next/previous file diff

export function DiffStack() {

    const selectedFiles = useAtomValue(selectedFilesAtom);

    return (
        <div className="flex-grow min-h-0 flex flex-col">
            {selectedFiles.map((file, index) => {
                return (
                    <div key={index}>
                        <p>{file.path}</p>
                    </div>
                )
            })}
        </div>
    );
}

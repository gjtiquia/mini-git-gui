import { Button } from "@/components/ui/button";
import { selectedFilesAtom, stackAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { GitCompare } from "lucide-react";
import { File } from "./types";

// Future can be options with dropdown
// But for now it is just a diff button
export function OptionsButton(props: { disabled: boolean; selectedFiles: File[] }) {

    const setSelectedFiles = useSetAtom(selectedFilesAtom);
    const setStack = useSetAtom(stackAtom);

    function openDiffStack() {
        setSelectedFiles(props.selectedFiles);
        setStack("Diff");
    }

    return (
        <Button
            size={"icon"}
            variant={"secondary"}
            onClick={() => openDiffStack()}
            disabled={props.disabled}
        >
            <GitCompare />
        </Button>
    );
}

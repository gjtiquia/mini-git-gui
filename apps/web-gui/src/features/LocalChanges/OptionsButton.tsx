import { Button } from "@/components/ui/button";
import { stackAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { GitCompare } from "lucide-react";

// Future can be options with dropdown
// But for now it is just a diff button
export function OptionsButton(props: { disabled: boolean; }) {

    const setStack = useSetAtom(stackAtom);

    function openDiffStack() {
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

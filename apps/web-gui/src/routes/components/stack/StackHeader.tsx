import { useSetAtom } from "jotai";
import { stackAtom } from "@/lib/atoms";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function StackHeader() {
    return (
        <div className="flex justify-end">
            <CloseStackButton />
        </div>
    );
}

function CloseStackButton() {
    const setStack = useSetAtom(stackAtom);

    function closeStack() {
        setStack("None");
    }

    return (
        <Button size="icon" variant={"ghost"} onClick={() => closeStack()}>
            <X className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    )
}

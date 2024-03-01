import { useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { stackAtom } from "@/lib/atoms";
import { Button } from "@/components/ui/button";

export function StackHeader() {

    const stack = useAtomValue(stackAtom);
    const title =
        stack === "Diff" ? "File Changes"
            : stack === "None" ? "None"
                : "None"

    return (
        <div className="flex justify-between items-center">
            <div className="pl-2">
                <p className="text-lg font-semibold">{title}</p>
            </div>

            <div>
                <CloseStackButton />
            </div>
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

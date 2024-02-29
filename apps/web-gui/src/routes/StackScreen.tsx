import { ExtractAtomValue, useAtomValue } from "jotai";
import { stackAtom } from "@/lib/atoms";
import { StackHeader } from "./components/stack/StackHeader";
import { DiffStack } from "../features/LocalChanges/DiffStack";

export function StackScreen() {

    const stack = useAtomValue(stackAtom);

    if (stack === "None")
        return null;

    return (
        <div className="absolute top-0 left-0 bg-background h-dvh w-dvw flex flex-col">
            <StackHeader />
            <StackContents stack={stack} />
        </div>
    );
}

function StackContents(props: { stack: ExtractAtomValue<typeof stackAtom>; }) {
    if (props.stack === "Diff")
        return <DiffStack />;
}

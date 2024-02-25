import { useState } from "react";
import { UnstagedView } from "./UnstagedView";
import { StagedView } from "./StagedView";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

type Tab = "Unstaged" | "Staged"

export function LocalChangesView() {

    const [tab, setTab] = useState<Tab>("Unstaged")

    // Minimal working example for nested scroll bars
    // min-height:0 is CRUCIAL to making sure children do not expand parent
    // As a general rule: add min-h-0 right after all flex-grow until the one that explicitly handles the overflow
    // return (
    //     <div className="p-2 flex-grow min-h-0 flex flex-col bg-blue-900/50">
    //         <p>tab bar</p>

    //         <div className="flex-grow min-h-0 flex flex-col bg-red-900/50">
    //             <div className="flex-grow min-h-0 flex flex-col overflow-auto bg-yellow-900/50">
    //                 <p>Select All</p>

    //                 <div className="flex flex-col bg-yellow-900/50">
    //                     {Array(25).fill(<p className="whitespace-nowrap">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, eligendi.</p>)}
    //                 </div>
    //             </div>

    //             <p>bottom</p>
    //         </div>
    //     </div>
    // )

    return (
        <div className="flex-grow min-h-0 p-2 border-t rounded-t-md flex flex-col gap-2">
            <TabBar tab={tab} setTab={setTab} />
            <TabView tab={tab} />
        </div>
    )
}

function TabView(props: { tab: Tab }) {

    const statusQuery = trpc.getStatus.useQuery();

    if (statusQuery.isPending || statusQuery.isFetching)
        return <p className="text-center">Loading git status...</p>

    if (statusQuery.isError)
        return <p className="text-center text-red-500">Error: {statusQuery.error.message}</p>

    if (props.tab === "Unstaged")
        return <UnstagedView unstagedFiles={statusQuery.data.unstagedFiles} />

    if (props.tab === "Staged")
        return <StagedView stagedFiles={statusQuery.data.stagedFiles} />
}

function TabBar(props: { tab: Tab, setTab: (tab: Tab) => void }) {
    return (
        <div className="grid grid-cols-2 divide-x-2">
            <TabButton
                title="Unstaged"
                tab={props.tab}
                targetTab="Unstaged"
                setTab={props.setTab}
                side="Left"
            />

            <TabButton
                title="Staged"
                tab={props.tab}
                targetTab="Staged"
                setTab={props.setTab}
                side="Right"
            />
        </div>
    );
}

type Side = "Left" | "Right"

function TabButton(props: { title: string, tab: Tab, targetTab: Tab, setTab: (tab: Tab) => void, side: Side }) {

    const isActive = props.tab === props.targetTab;
    const borderStyle = props.side === "Left" ? "rounded-r-none" : "rounded-l-none"

    return (
        <Button
            size={"sm"}
            variant={isActive ? "default" : "secondary"}
            className={borderStyle}
            onClick={() => props.setTab(props.targetTab)}
        >
            {props.title}
        </Button>
    )
}
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { UnstagedView } from "./UnstagedView";
import { StagedView } from "./StagedView";

type Tab = "Unstaged" | "Staged"

export function LocalChangesView() {

    const [tab, setTab] = useState<Tab>("Unstaged")

    return (
        <div className="h-full p-2 flex flex-col gap-2 border-t rounded-md">
            <TabBar tab={tab} setTab={setTab} />
            <Separator />
            <TabView tab={tab} />
        </div>
    )
}

function TabView(props: { tab: Tab }) {
    if (props.tab === "Unstaged")
        return <UnstagedView />

    if (props.tab === "Staged")
        return <StagedView />
}

function TabBar(props: { tab: Tab, setTab: (tab: Tab) => void }) {
    return (
        <div className="grid grid-cols-2 gap-2 divide-x-2">
            <TabButton
                title="Unstaged"
                tab={props.tab}
                targetTab="Unstaged"
                setTab={props.setTab}
            />

            <TabButton
                title="Staged"
                tab={props.tab}
                targetTab="Staged"
                setTab={props.setTab}
            />
        </div>
    );
}

function TabButton(props: { title: string, tab: Tab, targetTab: Tab, setTab: (tab: Tab) => void }) {

    const isActive = props.tab === props.targetTab;

    return (
        <button
            className={isActive ? "font-bold" : "font-bold text-muted"}
            onClick={() => props.setTab(props.targetTab)}
        >
            {props.title}
        </button>
    )
}
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
    // As a general rule: add min-h-0 right after all flex-grow
    // return (
    //     <div className="flex-grow min-h-0 flex flex-col bg-blue-900/50">
    //         <p>tab bar</p>

    //         <div className="flex-grow min-h-0 flex flex-col bg-red-900/50">
    //             <div className="flex grow min-h-0 overflow-y-auto bg-yellow-900/50">
    //                 <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias minus vitae adipisci eos sit sed neque vero rem esse, libero corrupti exercitationem consequatur, fugiat similique omnis? Enim tempore cupiditate deserunt similique. Soluta similique iusto cupiditate eum culpa laboriosam fuga aut exercitationem sapiente beatae modi vitae, sint provident, nemo asperiores tempora! In sit numquam voluptatibus voluptas autem sapiente necessitatibus id corporis rem, modi neque aperiam labore dolore sed a ea enim nihil laborum? Quos quibusdam officiis perspiciatis, fugit quae dolores? Dolorem tenetur recusandae eligendi hic tempore asperiores accusantium nulla ut perspiciatis, blanditiis porro esse corrupti labore temporibus in cumque cum sed eveniet odit minima sapiente nihil officiis facilis voluptatum? Vitae, odio dolorem. Praesentium ut quas ipsa dolore! Sapiente nostrum, tempore, quam quasi, ipsam dolores molestiae impedit soluta ut vel laboriosam. Quae odio tempore atque delectus ex est debitis veritatis totam non beatae corporis ut mollitia, doloribus voluptates voluptate magnam adipisci. Nulla, tempore. Officia laboriosam adipisci numquam harum amet? Obcaecati, voluptatem. Incidunt voluptatibus ipsum officiis inventore minus illo minima voluptate corporis, tempora, necessitatibus eaque alias eius nesciunt dicta quis qui quod asperiores aliquid nostrum. Alias veniam fugiat amet in dignissimos vero nesciunt harum suscipit, consequatur omnis sunt cupiditate delectus facilis dicta modi sapiente placeat ullam maxime enim. Unde cupiditate amet aliquid corporis illum molestiae sit ipsum fugiat officiis, delectus minima placeat, quos quaerat ut cumque nesciunt, quisquam necessitatibus omnis. Eligendi dolore sint officiis obcaecati doloribus quaerat autem ipsum nihil nulla quidem accusantium saepe voluptate aspernatur praesentium minus expedita tempora, reiciendis doloremque, deleniti quos earum quasi iure incidunt? Adipisci pariatur suscipit reiciendis rerum, minima atque! Aut enim sapiente voluptatibus expedita, maiores adipisci eum earum facere aspernatur blanditiis at, beatae doloremque sint unde quia iure qui quibusdam accusamus optio illo, modi natus. Veniam animi possimus corrupti sed molestias obcaecati totam dignissimos minus doloremque beatae!</p>
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
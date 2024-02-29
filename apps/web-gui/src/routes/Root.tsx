import { useAtomValue } from "jotai";
import { pageAtom } from "@/lib/atoms";
import { LocalChangesView } from "@/features/LocalChanges";
import { CommitsView } from "@/features/ShowAllCommits";
import { Header } from "./components/page/Header";
import { StackScreen } from "./StackScreen";

export function Root() {
    return (
        <>
            <div className="h-dvh flex flex-col">
                <Header />
                <PageContents />
            </div>

            <StackScreen />
        </>
    )
}

function PageContents() {
    const page = useAtomValue(pageAtom);

    if (page === "AllCommits")
        return <CommitsView />

    if (page === "LocalChanges")
        return <LocalChangesView />

    return null;
}

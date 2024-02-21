import { useAtomValue } from "jotai";
import { pageAtom } from "@/lib/atoms";
import { Header } from "@/components/Header";
import { LocalChangesView } from "@/features/LocalChanges";
import { CommitsView } from "@/features/ShowAllCommits";

export function Root() {
    return (
        <div className="h-dvh flex flex-col">
            <Header />
            <Content />
        </div>
    )
}

function Content() {
    const page = useAtomValue(pageAtom);

    if (page === "AllCommits")
        return <CommitsView />

    if (page === "LocalChanges")
        return <LocalChangesView />

    return null;
}
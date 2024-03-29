import { useAtomValue } from "jotai";
import { pageAtom, serverConnectionStateAtom } from "@/lib/atoms";
import { LocalChangesView } from "@/features/LocalChanges";
import { CommitsView } from "@/features/ShowAllCommits";
import { Toaster } from "@/components/ui/toaster"
import { ExternalStateProvider } from "@/providers/ExternalStateProvider";
import { Header } from "./components/page/Header";
import { StackScreen } from "./StackScreen";
import { PendingConnectionToServerView, ReconnectToServerView } from "./BeforeLoad";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export function Root() {
    const connectionState = useAtomValue(serverConnectionStateAtom);

    if (connectionState === "Pending")
        return <PendingConnectionToServerView />

    if (connectionState === "Error")
        return <ReconnectToServerView />

    // Only initialize the trpc client when the connection to server is established succeessfully
    return <AppRootWithProviders />
}

function AppRootWithProviders() {
    return (
        <ExternalStateProvider>
            <AppRoot />
        </ExternalStateProvider>
    )
}

function AppRoot() {

    const repoNameQuery = trpc.getRepoName.useQuery(undefined);
    useEffect(() => {
        if (repoNameQuery.data) {
            const repoName = repoNameQuery.data.repoName;
            document.title = "Mini Git GUI: " + repoName;
        }
    }, [repoNameQuery.data])

    return (
        <>
            <div className="h-dvh flex flex-col">
                <Header />
                <PageContents />
            </div>

            <StackScreen />
            <Toaster />
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

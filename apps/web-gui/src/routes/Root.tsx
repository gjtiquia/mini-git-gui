import { useAtomValue } from "jotai";
import { pageAtom, serverConnectionStateAtom } from "@/lib/atoms";
import { LocalChangesView } from "@/features/LocalChanges";
import { CommitsView } from "@/features/ShowAllCommits";
import { Toaster } from "@/components/ui/toaster"
import { ExternalStateProvider } from "@/providers/ExternalStateProvider";
import { Header } from "./components/page/Header";
import { StackScreen } from "./StackScreen";
import { PendingConnectionToServerView, ReconnectToServerView } from "./BeforeLoad";

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

// TODO : set document.title

function AppRoot() {
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

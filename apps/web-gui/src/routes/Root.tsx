import { useAtomValue } from "jotai";
import { pageAtom, serverConfigAtom } from "@/lib/atoms";
import { LocalChangesView } from "@/features/LocalChanges";
import { CommitsView } from "@/features/ShowAllCommits";
import { Toaster } from "@/components/ui/toaster"
import { ExternalStateProvider } from "@/providers/ExternalStateProvider";
import { Header } from "./components/page/Header";
import { StackScreen } from "./StackScreen";
import { PendingConnectionToServerView, ReconnectToServerView } from "./BeforeLoad";

export function Root() {
    const serverConfig = useAtomValue(serverConfigAtom);

    if (serverConfig.state === "Pending")
        return <PendingConnectionToServerView />

    if (serverConfig.state === "Error")
        return <ReconnectToServerView />

    // Only initialize the trpc client when the url from serverConfig is valid
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

import { Header } from "@/components/Header";
import { CommitsView } from "@/features/ShowAllCommits";

export function Root() {
    return (
        <div className="h-dvh flex flex-col">
            <Header />
            <CommitsView />
        </div>
    )
}
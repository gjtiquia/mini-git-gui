import { Header } from "@/components/Header";
import { CommitsView } from "@/features/ShowAllCommits";

export function Root() {
    return (
        <div className="p-2">
            <Header />
            <CommitsView />
        </div>
    )
}
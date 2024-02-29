import {
    Sheet,
    SheetContent, SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { ExtractAtomValue, useAtom } from "jotai";
import { Menu } from "lucide-react";
import { pageAtom } from "@/lib/atoms";

type InferredPage = ExtractAtomValue<typeof pageAtom>;

export function SidebarToggle() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [page, setPage] = useAtom(pageAtom);

    function navigateTo(toPage: InferredPage) {
        setPage(toPage);
        setIsSidebarOpen(false);
    }

    return (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </SheetTrigger>

            <SheetContent side={"left"} className="flex flex-col gap-4 px-0">
                <SheetHeader className="text-start px-4">
                    <SheetTitle>Mini Git GUI</SheetTitle>
                </SheetHeader>

                <ul className="list-disc">
                    <NavLink
                        title="All Commits"
                        page={page}
                        targetPage="AllCommits"
                        navigateTo={navigateTo}
                    />

                    <NavLink
                        title="Local Changes"
                        page={page}
                        targetPage="LocalChanges"
                        navigateTo={navigateTo}
                    />
                </ul>
            </SheetContent>
        </Sheet>
    );
}

function NavLink(props: { title: string, page: InferredPage, targetPage: InferredPage, navigateTo: (page: InferredPage) => void }) {
    return (
        <li className={props.page === props.targetPage ? "bg-muted" : "hover:bg-muted/35"}>
            <button
                className="text-start px-8 py-2 w-full"
                onClick={() => props.navigateTo(props.targetPage)}
            >
                {props.title}
            </button>
        </li>
    )
}

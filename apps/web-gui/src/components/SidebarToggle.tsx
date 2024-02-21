import {
    Sheet,
    SheetContent, SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function SidebarToggle() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function navigateTo() {
        // TODO : nav to page

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
                    <li className="bg-muted">
                        <button
                            className="text-start px-8 py-2 w-full"
                            onClick={() => navigateTo()}
                        >
                            All Commits
                        </button>
                    </li>

                    <li className={"hover:bg-muted/35"}>
                        <button
                            className="text-start px-8 py-2 w-full"
                            onClick={() => navigateTo()}
                        >
                            Local Changes
                        </button>
                    </li>
                </ul>
            </SheetContent>
        </Sheet>
    );
}

import {
    Sheet,
    SheetContent, SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export function SidebarToggle() {
    return (
        <Sheet>
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
                        <p className="px-8 py-2">
                            All Commits
                        </p>
                    </li>
                </ul>
            </SheetContent>
        </Sheet>
    );
}

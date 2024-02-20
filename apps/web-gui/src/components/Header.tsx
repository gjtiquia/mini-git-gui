import { ModeToggle } from "./ModeToggle";
import { ReloadButton } from "./ReloadButton";
import { SidebarToggle } from "./SidebarToggle";

export function Header() {
    return (
        <div className="p-2 flex justify-between">
            <div className="flex gap-2">
                <SidebarToggle />
            </div>

            <div className="flex gap-2">
                <ReloadButton />
                <ModeToggle />
            </div>
        </div>
    )
}

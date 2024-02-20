import { ModeToggle } from "./ModeToggle";
import { ReloadButton } from "./ReloadButton";

export function Header() {
    return (
        <div className="flex justify-end gap-2">
            <ReloadButton />
            <ModeToggle />
        </div>
    )
}

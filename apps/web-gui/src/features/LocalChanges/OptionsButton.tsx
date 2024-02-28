import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export function OptionsButton(props: { disabled: boolean; }) {
    return (
        <Button
            size={"icon"}
            variant={"secondary"}
            disabled={props.disabled}
        >
            <MoreVertical />
        </Button>
    );
}

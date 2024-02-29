import { RotateCw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export function ReloadButton() {
    const queryClient = useQueryClient();

    function reload() {
        // use queryClient instead of trpc utils because not all queries are via trpc
        queryClient.invalidateQueries();
    }

    return (
        <Button size="icon" variant={"secondary"} onClick={() => reload()}>
            <RotateCw className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    );
}

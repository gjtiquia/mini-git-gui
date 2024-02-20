import { RotateCw } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";

export function ReloadButton() {
    const queryClient = useQueryClient();

    function reload() {
        // use queryClient instead of trpc utils because not all queries are via trpc
        queryClient.invalidateQueries();
    }

    return (
        <Button size="icon" onClick={() => reload()}>
            <RotateCw className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    );
}

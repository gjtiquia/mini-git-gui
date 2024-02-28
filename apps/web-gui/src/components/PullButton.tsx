import { ArrowDownToLine } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";


export function PullButton() {

    const queryClient = useQueryClient();
    const pullMutation = trpc.pull.useMutation({
        onSettled: () => {
            // use queryClient instead of trpc utils because not all queries are via trpc
            queryClient.invalidateQueries();
        }
    });

    function pull() {
        pullMutation.mutate();
    }

    return (
        <Button size="icon" variant={"secondary"} onClick={() => pull()}>
            <ArrowDownToLine className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    );
}

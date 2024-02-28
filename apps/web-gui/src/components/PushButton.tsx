import { ArrowUpToLine } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";


export function PushButton() {

    const queryClient = useQueryClient();
    const pushMutation = trpc.push.useMutation({
        onSettled: () => {
            // use queryClient instead of trpc utils because not all queries are via trpc
            queryClient.invalidateQueries();
        }
    });

    function push() {
        pushMutation.mutate();
    }

    return (
        <Button size="icon" variant={"secondary"} onClick={() => push()}>
            <ArrowUpToLine className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    );
}

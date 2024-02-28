import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";


export function FetchButton() {

    const queryClient = useQueryClient();
    const fetchMutation = trpc.fetch.useMutation({
        onSettled: () => {
            // use queryClient instead of trpc utils because not all queries are via trpc
            queryClient.invalidateQueries();
        }
    });

    function fetch() {
        fetchMutation.mutate();
    }

    return (
        <Button size="icon" variant={"secondary"} onClick={() => fetch()}>
            <ArrowDown className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    );
}

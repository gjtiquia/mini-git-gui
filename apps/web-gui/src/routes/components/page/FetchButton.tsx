import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export function FetchButton() {
    return (
        <FetchDialog />
    );
}

function FetchDialog() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const queryClient = useQueryClient();
    const fetchMutation = trpc.fetch.useMutation({
        onSuccess: () => {
            setIsDialogOpen(false);
        },
        onSettled: () => {
            // use queryClient instead of trpc utils because not all queries are via trpc
            queryClient.invalidateQueries();
        }
    });

    function onDialogOpen() {
        fetchMutation.reset()
    }

    function fetch() {
        fetchMutation.mutate();
    }

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild onClick={() => onDialogOpen()}>
                <Button size="icon" variant={"secondary"}>
                    <ArrowDown className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Fetch</AlertDialogTitle>
                    <AlertDialogDescription>
                        Fetch latest changes from remote repository.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {fetchMutation.isError
                    && <p className="text-red-500">{fetchMutation.error.message}</p>
                }

                {(fetchMutation.isPending)
                    ? <PendingFetchFooter />
                    : <DefaultFetchFooter onFetchClicked={() => fetch()} />
                }
            </AlertDialogContent>
        </AlertDialog>
    )
}

function DefaultFetchFooter(props: { onFetchClicked: () => void }) {
    return (
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={props.onFetchClicked}>Fetch</Button>
        </AlertDialogFooter>
    )
}

function PendingFetchFooter() {
    return (
        <AlertDialogFooter>
            <Button disabled>Fetching...</Button>
        </AlertDialogFooter>
    )
}
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
import { ArrowDownToLine } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export function PullButton() {
    return (
        <PullDialog />
    );
}

function PullDialog() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const queryClient = useQueryClient();
    const pullMutation = trpc.pull.useMutation({
        onSuccess: () => {
            setIsDialogOpen(false);
        },
        onSettled: () => {
            // use queryClient instead of trpc utils because not all queries are via trpc
            queryClient.invalidateQueries();
        }
    });

    function onDialogOpen() {
        pullMutation.reset()
    }

    function pull() {
        pullMutation.mutate();
    }

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild onClick={() => onDialogOpen()}>
                <Button size="icon" variant={"secondary"}>
                    <ArrowDownToLine className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Pull</AlertDialogTitle>
                    <AlertDialogDescription>
                        Pull remote branches and merge them to your local branch.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {pullMutation.isError
                    && <p className="text-red-500">{pullMutation.error.message}</p>
                }

                {(pullMutation.isPending)
                    ? <PendingPullFooter />
                    : <DefaultPullFooter onPullClicked={() => pull()} />
                }
            </AlertDialogContent>
        </AlertDialog>
    )
}

function DefaultPullFooter(props: { onPullClicked: () => void }) {
    return (
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={props.onPullClicked}>Pull</Button>
        </AlertDialogFooter>
    )
}

function PendingPullFooter() {
    return (
        <AlertDialogFooter>
            <Button disabled>Pulling...</Button>
        </AlertDialogFooter>
    )
}
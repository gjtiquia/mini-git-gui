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
import { ArrowUpFromLine } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export function PushButton() {
    return (
        <PushDialog />
    );
}

function PushDialog() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const queryClient = useQueryClient();
    const pushMutation = trpc.push.useMutation({
        onSuccess: () => {
            setIsDialogOpen(false);
        },
        onSettled: () => {
            // use queryClient instead of trpc utils because not all queries are via trpc
            queryClient.invalidateQueries();
        }
    });

    function onDialogOpen() {
        pushMutation.reset()
    }

    function push() {
        pushMutation.mutate();
    }

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild onClick={() => onDialogOpen()}>
                <Button size="icon" variant={"secondary"}>
                    <ArrowUpFromLine className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Push</AlertDialogTitle>
                    <AlertDialogDescription>
                        Push your local changes to remote repository.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {pushMutation.isError
                    && <p className="text-red-500">{pushMutation.error.message}</p>
                }

                {(pushMutation.isPending)
                    ? <PendingPushFooter />
                    : <DefaultPushFooter onPushClicked={() => push()} />
                }
            </AlertDialogContent>
        </AlertDialog>
    )
}

function DefaultPushFooter(props: { onPushClicked: () => void }) {
    return (
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={props.onPushClicked}>Push</Button>
        </AlertDialogFooter>
    )
}

function PendingPushFooter() {
    return (
        <AlertDialogFooter>
            <Button disabled>Pushing...</Button>
        </AlertDialogFooter>
    )
}
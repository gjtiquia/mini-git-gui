import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function CommitDialog(props: { isOpen: boolean, onOpenChange: (open: boolean) => void, onCommitClicked: () => void }) {
    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Commit All Staged Files</DialogTitle>
                    <DialogDescription>All staged files will be commited.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <p>TODO: Commit Subject (Required)</p>
                        <p>TODO: Commit Description (Optional)</p>
                    </div>

                    <Button onClick={props.onCommitClicked}>
                        Commit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function CommitDialog(props: { isOpen: boolean, onOpenChange: (open: boolean) => void, onCommitClicked: (commitInput: { message: string, description?: string }) => void }) {

    const [commitMessage, setCommitMessage] = useState("");
    const [commitDescription, setCommitDescription] = useState("");

    function onCommitClicked() {

        const message = commitMessage;
        const description = commitDescription.length > 0 ? commitDescription : undefined;

        const commitInput = { message, description };
        // console.log("commitInput from dialog", commitInput);

        props.onCommitClicked(commitInput);

        // Clear input after click
        setCommitMessage("");
        setCommitDescription("");
    }

    function canPressCommit() {
        return commitMessage.length > 0;
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Commit All Staged Files</DialogTitle>
                    <DialogDescription>All staged files will be commited.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="commit-message">Message</Label>
                        <Input id="commit-message" placeholder="Required" value={commitMessage} onChange={(x) => setCommitMessage(x.target.value)} />

                        <Label htmlFor="commit-description">Description</Label>
                        <Input id="commit-description" placeholder="(Optional)" value={commitDescription} onChange={(x) => setCommitDescription(x.target.value)} />
                    </div>

                    <Button onClick={onCommitClicked} disabled={!canPressCommit()}>
                        Commit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}
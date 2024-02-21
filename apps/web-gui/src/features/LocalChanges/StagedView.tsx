import { Button } from "@/components/ui/button";

export function StagedView() {
    return (
        <div className="flex-grow flex flex-col gap-2">
            <div className="flex-grow">
                <p>TODO : Staged Table</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Button variant={"secondary"}>
                    Unstage
                </Button>
                <Button className="col-span-2">
                    Commit
                </Button>
            </div>
        </div>
    );
}

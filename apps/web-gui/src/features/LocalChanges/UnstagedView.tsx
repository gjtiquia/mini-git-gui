import { Button } from "@/components/ui/button";

export function UnstagedView() {
    return (
        <div className="flex-grow flex flex-col gap-2">
            <div className="flex-grow">
                <p>TODO : Unstaged Table</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Button variant={"destructive"}>
                    Discard
                </Button>
                <Button className="col-span-2">
                    Stage
                </Button>
            </div>
        </div>
    );
}

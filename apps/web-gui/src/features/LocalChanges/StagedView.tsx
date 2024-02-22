import { Button } from "@/components/ui/button";
import { AppRouterOutput } from "@/lib/trpc";

type StagedFile = AppRouterOutput["getStatus"]["stagedFiles"][0]

export function StagedView(props: { stagedFiles: StagedFile[] }) {
    return (
        <div className="flex-grow flex flex-col gap-2">
            <div className="flex-grow">
                {props.stagedFiles.map(x => {
                    return (
                        <div className="flex gap-4">
                            <p>{x.status}</p>
                            <p>{x.path}</p>
                        </div>
                    )
                })}
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

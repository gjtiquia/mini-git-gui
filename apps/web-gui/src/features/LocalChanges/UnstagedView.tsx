import { Button } from "@/components/ui/button";
import { AppRouterOutput } from "@/lib/trpc";

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0]

export function UnstagedView(props: { unstagedFiles: UnstagedFile[] }) {
    return (
        <div className="flex-grow flex flex-col gap-2">
            <div className="flex-grow">
                {props.unstagedFiles.map(x => {
                    return (
                        <div className="flex gap-4">
                            <p>{x.status}</p>
                            <p>{x.path}</p>
                        </div>

                    )
                })}
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

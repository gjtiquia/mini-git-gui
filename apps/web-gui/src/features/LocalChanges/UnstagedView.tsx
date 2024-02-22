import { Button } from "@/components/ui/button";
import { AppRouterOutput } from "@/lib/trpc";

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0]

export function UnstagedView(props: { unstagedFiles: UnstagedFile[] }) {

    const unstagedFiles = props.unstagedFiles;
    // const unstagedFiles = dummyUnstagedFiles;

    return (
        <div className="flex-grow flex flex-col gap-2">
            <div className="flex-grow overflow-x-scroll">
                {unstagedFiles.map(x => {
                    return (
                        <div className="flex gap-4 whitespace-nowrap">
                            <p>{x.statusCode}</p>
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

const dummyUnstagedFiles: UnstagedFile[] = [];
for (let i = 0; i < 10; i++) {
    dummyUnstagedFiles.push({
        statusCode: "M",
        status: "modified",
        path: "/a/really/super-super/duper/long/path/that/is/actually/like/really/long.jpg"
    })
}
import { trpc } from "../lib/trpc"

export function Root() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isPending)
        return <p>Loading...</p>

    return (
        <div className="flex flex-col gap-4">
            {getCommitsQuery.data?.map(x => {
                return (
                    <div>
                        <p>Subject: {x.subject}</p>
                        <p>Author: {x.author}</p>
                        <p>Hash: {x.hash}</p>
                        <p>Date: {x.date.toLocaleLowerCase()}</p>
                    </div>
                )
            })}
        </div>
    )
}
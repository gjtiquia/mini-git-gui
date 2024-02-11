import { trpc } from "../lib/trpc"

export function Root() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isPending)
        return <p>Loading...</p>

    if (getCommitsQuery.isError)
        return <p className="text-red-500">Error: {getCommitsQuery.error.message}</p>

    return (
        <div className="flex flex-col">
            {getCommitsQuery.data?.map(x => {

                const date = new Date(x.timestamp * 1000);

                return (
                    <div key={x.hash} className="flex gap-2 px-2 py-1">
                        <svg
                            viewBox="-50 -50 100 100" // Shift origin from top left to center
                            xmlns="http://www.w3.org/2000/svg"
                            className="min-w-2 max-w-2"
                        >
                            <circle cx="0" cy="0" r="50%" fill="red" />
                        </svg>

                        <div className="flex-grow">
                            <p className="font-bold text-sm line-clamp-1">{x.subject}</p>

                            <div className="flex justify-between gap-2 text-xs">
                                <p>{x.author}</p>
                                <p>{x.abbreviatedHash}</p>
                                <p>{date.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
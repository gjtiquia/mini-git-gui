import { trpc } from "../lib/trpc"

export function Root() {

    const getCommitsQuery = trpc.getAllCommits.useQuery();

    if (getCommitsQuery.isLoading)
        return <p>Loading...</p>

    return (
        <p>{JSON.stringify(getCommitsQuery.data)}</p>
    )
}
import { getStatusAsync } from "../features/getStatus";
import { publicProcedure } from "../lib/trpc";
import { rootDirectory } from "../store";

export function getStatusProcedure() {
    return publicProcedure
        .query(async () => {
            const status = await getStatusAsync(rootDirectory);

            // console.log(Date.now() + " getAllStatus")
            // console.log(status);
            return status;
        });
}

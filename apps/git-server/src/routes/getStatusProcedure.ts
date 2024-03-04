import { getStatusAsync } from "../features/getStatus";
import { publicProcedure } from "../lib/trpc";
import { getRootDirectory } from "../store";

export function getStatusProcedure() {
    return publicProcedure
        .query(async () => {
            const status = await getStatusAsync(getRootDirectory());

            // console.log(Date.now() + " getAllStatus")
            // console.log(status);
            return status;
        });
}

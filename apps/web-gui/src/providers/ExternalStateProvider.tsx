import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/ui/use-toast"
import { useAtomValue } from 'jotai';
import { serverConfigAtom } from '@/lib/atoms';

export function ExternalStateProvider(props: { children: React.ReactNode }) {

    const { toast } = useToast()
    const [queryClient] = useState(() => new QueryClient({
        queryCache: new QueryCache({
            // replacement of onError per query in React Query v4. Global handling instead.
            // https://tkdodo.eu/blog/react-query-error-handling#the-global-callbacks
            // https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#defining-on-demand-messages
            onError: (error, query) => {
                console.error("QueryCache: Something went wrong:", error.message)
                console.error("Error:", error);
                console.error("Query:", query);
                console.error("Query Meta:", query.meta)

                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: error.message,
                })
            }
        }),
        mutationCache: new MutationCache({
            onError: (error, variables, context, mutation) => {
                console.error("MutationCache: Something went wrong:", error.message, variables, context, mutation)
                console.error("Error:", error);
                console.error("Variables:", variables);
                console.error("Context:", context);
                console.error("Mutation:", mutation);

                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: error.message,
                })
            },
        })
    }));

    const serverConfig = useAtomValue(serverConfigAtom);
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: serverConfig.url + "/app",
                }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
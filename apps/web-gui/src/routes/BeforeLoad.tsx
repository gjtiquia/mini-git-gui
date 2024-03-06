import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { serverConnectionStateAtom, serverUrlAtom } from "@/lib/atoms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function PendingConnectionToServerView() {

    const url = useAtomValue(serverUrlAtom);
    const [connectionState, setConnectionState] = useAtom(serverConnectionStateAtom);

    useEffect(() => {
        async function healthcheckAsync() {
            try {
                const response = await (fetch(url + "/healthcheck"));
                // console.log(response);
                if (!response.ok) {
                    onError();
                    return;
                }

                const jsonData = await response.json();
                if (jsonData.message !== "ok") {
                    onError();
                    return;
                }

                onSuccess();
            }
            catch (e) {
                onError();
            }
        }

        function onSuccess() {
            setConnectionState("Success");
        }

        function onError() {
            setConnectionState("Error");
        }

        healthcheckAsync();
    }, [url, connectionState, setConnectionState]);

    return (
        <p>Connecting to git server...</p>
    );
}

export function ReconnectToServerView() {

    const [url, setUrl] = useAtom(serverUrlAtom);
    const setConnectionState = useSetAtom(serverConnectionStateAtom);
    const [inputUrl, setInpurUrl] = useState(url);

    function onReconnectClicked() {
        // console.log("Setting server url to:", inputUrl);
        setUrl(inputUrl);
        setConnectionState("Pending");
    }

    return (
        <div className="h-dvh p-2 flex flex-col justify-center items-center gap-4">
            <h1 className="font-bold text-2xl">Mini Git GUI</h1>

            <p>Unable to connect to git server!</p>
            <p>Please re-enter the server URL and try again</p>

            <Input placeholder="eg. http://localhost:3000" value={inputUrl} onChange={e => setInpurUrl(e.target.value)} />
            <Button onClick={onReconnectClicked}>Reconnect</Button>
        </div>
    );
}

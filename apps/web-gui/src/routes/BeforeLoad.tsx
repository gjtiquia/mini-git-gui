import { useAtom } from "jotai";
import { serverConfigAtom } from "@/lib/atoms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function PendingConnectionToServerView() {

    const [serverConfig, setServerConfig] = useAtom(serverConfigAtom);

    useEffect(() => {
        async function healthcheckAsync() {
            try {
                const response = await (fetch(serverConfig.url + "/healthcheck"));
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
            setServerConfig({ state: "Success", url: serverConfig.url });
        }

        function onError() {
            setServerConfig({ state: "Error", url: serverConfig.url });
        }

        healthcheckAsync();
    }, [serverConfig, setServerConfig]);

    return (
        <p>Connecting to git server...</p>
    );
}

export function ReconnectToServerView() {

    const [serverConfig, setServerConfig] = useAtom(serverConfigAtom);
    const [url, setUrl] = useState(serverConfig.url);

    function onReconnectClicked() {
        // console.log("Setting server url to:", url);
        setServerConfig({ state: "Pending", url });
    }

    return (
        <div className="h-dvh p-2 flex flex-col justify-center items-center gap-4">
            <h1 className="font-bold text-2xl">Mini Git GUI</h1>

            <p>Unable to connect to git server!</p>
            <p>Please re-enter the server URL and try again</p>

            <Input placeholder="eg. http://localhost:3000" value={url} onChange={e => setUrl(e.target.value)} />
            <Button onClick={onReconnectClicked}>Reconnect</Button>
        </div>
    );
}

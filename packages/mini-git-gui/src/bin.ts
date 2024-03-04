#!/usr/bin/env node

import getPort, { portNumbers } from "get-port";
import { main } from "@mini-git-gui/git-server";

bin();

async function bin() {
    const availablePort = await getPort({ port: portNumbers(3000, 65000) })
    process.env.PORT = availablePort.toString();

    const rootDirectory = process.cwd();
    // const rootDirectory = "../../../mini-link-stash"

    main(rootDirectory);
}

#!/usr/bin/env node

process.env.PORT = "4000";

import { main } from "@mini-git-gui/git-server"
main();
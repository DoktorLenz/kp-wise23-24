

import { Cli } from "./cli.ts";
import { Environment } from "./environment.ts";

const environment = new Environment(new Cli());

await environment.loadTsCommands();
environment.run();
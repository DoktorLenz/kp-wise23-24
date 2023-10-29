
import { Cli } from "./Cli.ts";
import { Environment } from "./core/environment.ts";

const environment = new Environment(new Cli());

await environment.loadTsCommands();
environment.run();
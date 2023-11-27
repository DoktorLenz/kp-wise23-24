import { clearConsole } from "./utils.ts";
import { StateMaschine } from "./statemaschine/statemaschine.ts";

clearConsole();

const statemaschine = new StateMaschine();

statemaschine.start();

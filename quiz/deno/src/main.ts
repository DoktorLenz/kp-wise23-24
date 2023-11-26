import { clearConsole } from "./utils.ts";
import { User } from "./user.ts";
import { StateMaschine } from "./statemaschine/statemaschine.ts";

clearConsole();

const statemaschine = new StateMaschine();

statemaschine.start();

async function register() {
  clearConsole();
  await User.register();
}

async function join() {}

function exit() {
  clearConsole();
  console.log("Hope to see you soon, bye!");
}

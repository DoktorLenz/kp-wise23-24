import {
  Select,
  SelectOption,
  SelectOptionGroup,
  SelectOptions,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/select.ts";
import { clearConsole } from "./utils.ts";
import { getUsers, User } from "./user.ts";
import { compareSync, hashSync } from "npm:bcrypt-ts";

clearConsole();

console.log(compareSync("123", hashSync("123")));

while (true) {
  await run();
}

async function run() {
  enum Action {
    Login = "login",
    Register = "register",
    Join = "join",
    Exit = "exit",
  }

  const mainOptions: (SelectOption<Action>)[] = [];

  if ((await getUsers()).length > 0) {
    mainOptions.push({ name: "Login", value: Action.Login });
  }
  mainOptions.push({ name: "Register", value: Action.Register });
  mainOptions.push({ name: "Join Quiz", value: Action.Join });
  mainOptions.push({ name: "Exit", value: Action.Exit });

  const action: string = await Select.prompt({
    message: "Welcome to THE QUIZ APP",
    options: mainOptions,
  });

  switch (action) {
    case Action.Login:
      await login();
      break;
    case Action.Register:
      await register();
      break;

    case Action.Join:
      join();
      break;
    case Action.Exit:
      exit();
      break;
  }
}

async function register() {
  clearConsole();
  await User.register();
}

async function login() {
  try {
    const user = await User.login();
    console.log("Welcome " + user.username);
  } catch (error) {
    console.log(error);
  }
}

async function join() {}

function exit() {
  clearConsole();
  console.log("Hope to see you soon, bye!");
}

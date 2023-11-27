import {
  Input,
  Secret,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { IState } from "./state.ts";
import { User } from "../../user.ts";
import { InitState } from "./init-state.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts";
import { clearConsole } from "../../utils.ts";

export class RegisterState implements IState {
  async run(): Promise<IState> {
    const username = await Input.prompt({
      message: "Choose a username: ",
      validate: async (value) => {
        if (value.length < 3) {
          return "Username must be at least 3 characters long";
        }

        if (await User.isUsernameTaken(value)) {
          return "Username already taken";
        }

        return true;
      },
    });

    const password = await Secret.prompt({
      message: "Set a password: ",
      validate: (value) =>
        value.length < 8 ? "Password must be at least 8 characters long" : true,
    });

    await Secret.prompt({
      message: "Repeate password: ",
      validate: (value) => value === password ? true : "Passwords do not match",
    });

    clearConsole();
    console.log("Creating user...");
    await sleep(2);
    clearConsole();
    console.log("User created!");
    User.create(username, password);
    await sleep(2);

    return new InitState();
  }
}

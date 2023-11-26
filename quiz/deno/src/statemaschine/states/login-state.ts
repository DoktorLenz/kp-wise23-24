import {
  Input,
  Secret,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { getUsers, User } from "../../user.ts";
import { IState } from "./state.ts";
import { InitState } from "./init-state.ts";
import { LoggedInState } from "./logged-in/logged-in-state.ts";

export class LoginState implements IState {
  async run(): Promise<IState> {
    const username = await Input.prompt("Username: ");
    console.log(username);
    const password = await Secret.prompt("Password: ");

    const user = await User.checkLogin(username, password);
    if (user) {
      return new LoggedInState(user);
    }

    return new InitState();
  }
}

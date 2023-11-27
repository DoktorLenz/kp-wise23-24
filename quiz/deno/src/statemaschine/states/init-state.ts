import {
  Select,
  SelectOption,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { IState } from "./state.ts";
import { LoginState } from "./login-state.ts";
import { ExitState } from "./exit-state.ts";
import { RegisterState } from "./register-state.ts";
import { User } from "../../user.ts";

export class InitState implements IState {
  async run(): Promise<IState> {
    enum Action {
      Login = "login",
      Register = "register",
      Join = "join",
      Exit = "exit",
    }

    const options: (SelectOption<Action>)[] = [];

    if (await User.isAnyUserRegistered()) {
      options.push({ name: "Login", value: Action.Login });
    }
    options.push({ name: "Register", value: Action.Register });
    options.push({ name: "Join Quiz", value: Action.Join });
    options.push({ name: "Exit", value: Action.Exit });

    const action: string = await Select.prompt({
      message: "Welcome to THE QUIZ APP",
      options: options,
    });

    switch (action) {
      case Action.Login:
        return new LoginState();
      case Action.Register:
        return new RegisterState();
      case Action.Join:
        return new InitState();
      case Action.Exit:
        return new ExitState();
    }
    return new InitState();
  }
}
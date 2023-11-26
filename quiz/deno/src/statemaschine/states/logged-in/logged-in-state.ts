import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { User } from "../../../user.ts";
import { IState } from "../state.ts";
import { InitState } from "../init-state.ts";

export class LoggedInState implements IState {
  constructor(private readonly user: User) {}

  async run(): Promise<IState> {
    enum Action {
      Logout = "logout",
    }

    const action: string = await Select.prompt({
      "message": `Hello ${this.user.username}, what do you want to do?`,
      "options": [
        { name: "Logout", value: Action.Logout },
      ],
    });

    switch (action) {
      case Action.Logout:
        return new InitState();
    }

    return new InitState();
  }
}

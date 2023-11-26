import { IState } from "./state.ts";

export class ExitState implements IState {
  async run(): Promise<IState> {
    return Deno.exit(0);
  }
}

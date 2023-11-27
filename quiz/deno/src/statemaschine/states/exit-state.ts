import { IState } from '@states/state.ts';

export class ExitState implements IState {
	async run(): Promise<IState> {
		return Deno.exit(0);
	}
}

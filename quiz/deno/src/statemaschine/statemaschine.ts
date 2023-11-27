import { InitState } from '@states/init-state.ts';
import { IState } from '@states/state.ts';
import { clearConsole } from '@src/utils.ts';

export class StateMaschine {
	private state: IState = new InitState();

	public async start() {
		while (this.state) {
			clearConsole();
			this.state = await this.state.run();
		}
	}
}

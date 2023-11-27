import { Input, Secret } from '@cliffy/prompt/mod.ts';
import { User } from '@src/user.ts';
import { InitState } from '@states/init-state.ts';
import { LoggedInState } from '@states/logged-in/logged-in-state.ts';
import { IState } from '@states/state.ts';

export class LoginState implements IState {
	async run(): Promise<IState> {
		const username = await Input.prompt('Username: ');
		const password = await Secret.prompt('Password: ');

		const user = await User.checkLogin(username, password);
		if (user) {
			return new LoggedInState(user);
		}

		return new InitState();
	}
}

import { Input, Secret } from '@cliffy/prompt/mod.ts';
import { User } from '@src/user.ts';
import { LoggedInState } from '@states/logged-in/logged-in-state.ts';
import { IState } from '@states/state.ts';
import { UI } from '@src/utils.ts';

export class LoginState implements IState {
	async run(): Promise<IState> {
		const username = await Input.prompt('Username: ');
		const password = await Secret.prompt('Password: ');

		try {
			const user = await User.checkLogin(username, password);
			return new LoggedInState(user);
		} catch {
			UI.prompt(
				'%cInvalid username or password',
				'color: red',
			);
			await UI.pause(2);
			return new LoginState();
		}
	}
}

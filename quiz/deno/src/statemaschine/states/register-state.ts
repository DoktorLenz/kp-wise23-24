import { sleep } from '@sleep';
import { Input, Secret } from '@cliffy/prompt/mod.ts';
import { User } from '@src/user.ts';
import { IState } from '@states/state.ts';
import { InitState } from '@states/init-state.ts';
import { clearConsole } from '@src/utils.ts';

export class RegisterState implements IState {
	async run(): Promise<IState> {
		const username = await Input.prompt({
			message: 'Choose a username: ',
			validate: async (value) => {
				if (value.length < 3) {
					return 'Username must be at least 3 characters long';
				}

				if (await User.isUsernameTaken(value)) {
					return 'Username already taken';
				}

				return true;
			},
		});

		const password = await Secret.prompt({
			message: 'Set a password: ',
			validate: (value) =>
				value.length < 8
					? 'Password must be at least 8 characters long'
					: true,
		});

		await Secret.prompt({
			message: 'Repeate password: ',
			validate: (value) =>
				value === password
					? true
					: 'Passwords do not match',
		});

		clearConsole();
		console.log('Creating user...');
		await sleep(2);
		clearConsole();
		console.log('User created!');
		User.create(username, password);
		await sleep(2);

		return new InitState();
	}
}

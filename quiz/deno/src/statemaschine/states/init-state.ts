import { Select, SelectOption } from '@cliffy/prompt/mod.ts';
import { User } from '@src/user.ts';
import { ExitState } from '@states/exit-state.ts';
import { LoginState } from '@states/login-state.ts';
import { RegisterState } from '@states/register-state.ts';
import { IState } from '@states/state.ts';
import { JoinQuizState } from '@states/quiz/participate/join-quiz-state.ts';

export class InitState implements IState {
	async run(): Promise<IState> {
		enum Action {
			Login = 'login',
			Register = 'register',
			Join = 'join',
			Exit = 'exit',
		}

		const options: (SelectOption<Action>)[] = [];

		if (await User.isAnyUserRegistered()) {
			options.push({ name: 'Login', value: Action.Login });
		}
		options.push({ name: 'Register', value: Action.Register });
		options.push({ name: 'Join Quiz', value: Action.Join });
		options.push({ name: 'Exit', value: Action.Exit });

		const action: string = await Select.prompt({
			message: 'Welcome to THE QUIZ APP',
			options: options,
		});

		switch (action) {
			case Action.Login:
				return new LoginState();
			case Action.Register:
				return new RegisterState();
			case Action.Join:
				return new JoinQuizState();
			case Action.Exit:
				return new ExitState();
		}
		return new InitState();
	}
}

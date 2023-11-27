import { Select } from '@cliffy/prompt/mod.ts';
import { User } from '@src/user.ts';
import { InitState } from '@states/init-state.ts';
import { ManageQuizzesState } from '@states/quiz/manage/manage-quizzes-state.ts';
import { IState } from '@states/state.ts';

export class LoggedInState implements IState {
	constructor(private readonly user: User) {}

	async run(): Promise<IState> {
		enum Action {
			ManageQuizzes = 'manage-quizzes',
			Logout = 'logout',
		}

		const action: string = await Select.prompt({
			'message':
				`Hello ${this.user.username}, what do you want to do?`,
			'options': [
				{
					name: 'Manage Your Quizzes',
					value: Action.ManageQuizzes,
				},
				{ name: 'Logout', value: Action.Logout },
			],
		});

		switch (action) {
			case Action.ManageQuizzes:
				return new ManageQuizzesState(this.user);
			case Action.Logout:
				return new InitState();
		}

		return new InitState();
	}
}

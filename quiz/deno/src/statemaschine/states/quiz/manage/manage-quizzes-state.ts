import { Select, SelectOption } from '@cliffy/prompt/mod.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { User } from '@src/user.ts';
import { LoggedInState } from '@states/logged-in/logged-in-state.ts';
import { IState } from '@states/state.ts';
import { DeleteQuizState } from '@states/quiz/manage/delete-quiz-state.ts';
import { NewQuizState } from '@states/quiz/manage/new-quiz-state.ts';

export class ManageQuizzesState implements IState {
	constructor(private readonly user: User) {
	}

	async run() {
		enum Action {
			New = 'new',
			Edit = 'edit',
			Delete = 'delete',
			Back = 'back',
		}

		const options: (SelectOption<Action>)[] = [];
		options.push({ name: 'New Quiz', value: Action.New });
		if (await Quiz.isAnyQuizRegistered(this.user)) {
			options.push({ name: 'Edit Quiz', value: Action.Edit });
			options.push({
				name: 'Delete Quiz',
				value: Action.Delete,
			});
		}
		options.push({ name: 'Back', value: Action.Back });

		const action: string = await Select.prompt({
			'message': 'Manage Quizzes',
			'options': options,
		});

		switch (action) {
			case Action.New:
				return new NewQuizState(this.user);
			case Action.Edit:
				break;
			case Action.Delete:
				return new DeleteQuizState(this.user);
			case Action.Back:
				return new LoggedInState(this.user);
		}

		return new ManageQuizzesState(this.user);
	}
}

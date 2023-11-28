import { User } from '@src/user.ts';
import { Select, SelectOption } from '@cliffy/prompt/mod.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { OnEditQuizState } from '@states/quiz/manage/on-edit-quiz-state.ts';
import { ManageQuizzesState } from '@states/quiz/manage/manage-quizzes-state.ts';
import { IState } from '@states/state.ts';

export class EditQuizState implements IState {
	constructor(
		private readonly user: User,
	) {}

	async run() {
		const options: (SelectOption<Quiz | null>)[] =
			(await Quiz.getAllQuizzesForUser(this.user)).map(
				(quiz) => {
					return { name: quiz.name, value: quiz };
				},
			);

		options.unshift({ name: '[Back]', value: null });

		const quiz = await Select.prompt({
			message: 'Which quiz should be edited?',
			options: options,
			maxRows: 10,
			search: true,
			searchLabel: 'Search for quiz',
		});

		if (quiz !== null) {
			return new OnEditQuizState(this.user, quiz);
		}

		return new ManageQuizzesState(this.user);
	}
}

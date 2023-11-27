import { IState } from '@states/state.ts';
import { Select, SelectOption } from '@cliffy/prompt/mod.ts';
import { sleep } from '@sleep';
import { Quiz } from '@src/quiz/quiz.ts';
import { User } from '@src/user.ts';
import { clearConsole } from '@src/utils.ts';
import { ManageQuizzesState } from '@states/quiz/manage/manage-quizzes-state.ts';

export class DeleteQuizState implements IState {
	constructor(private readonly user: User) {}

	async run() {
		const options: (SelectOption<Quiz | null>)[] =
			(await Quiz.getAllQuizzesForUser(this.user)).map(
				(quiz) => {
					return { name: quiz.name, value: quiz };
				},
			);

		// insert one option at first position in the options array
		options.unshift({ name: '[Back]', value: null });

		const quiz = await Select.prompt({
			message: 'Which quiz should be deleted?',
			options: options,
			maxRows: 10,
			search: true,
			searchLabel: 'Search for quiz',
		});

		if (quiz !== null) {
			clearConsole();
			console.log('Deleting quiz...');
			await sleep(2);
			clearConsole();
			console.log('Quiz deleted!');
			await quiz.delete();
			await sleep(2);
		}

		return new ManageQuizzesState(this.user);
	}
}

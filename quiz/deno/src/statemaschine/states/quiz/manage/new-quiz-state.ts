import { Input } from '@cliffy/prompt/input.ts';
import { sleep } from '@sleep';
import { Quiz } from '@src/quiz/quiz.ts';
import { User } from '@src/user.ts';
import { clearConsole } from '@src/utils.ts';
import { IState } from '@states/state.ts';
import { EditQuizState } from '@states/quiz/manage/edit-quiz-state.ts';

export class NewQuizState implements IState {
	constructor(private readonly user: User) {}

	async run() {
		const quizName = await Input.prompt({
			message: 'How should the quiz be named?',
			minLength: 1,
			maxLength: 100,
		});

		clearConsole();
		console.log('Creating quiz...');
		await sleep(2);
		clearConsole();
		console.log('Quiz created!');
		Quiz.create(this.user, quizName);
		await sleep(2);

		return new EditQuizState(this.user, quizName);
	}
}

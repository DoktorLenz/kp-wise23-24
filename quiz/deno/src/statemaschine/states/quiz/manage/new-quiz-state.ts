import { Input } from '@cliffy/prompt/input.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { User } from '@src/user.ts';
import { UI } from '@src/utils.ts';
import { IState } from '@states/state.ts';
import { EditQuizState } from './edit-quiz-state.ts';

export class NewQuizState implements IState {
	constructor(private readonly user: User) {}

	async run() {
		const quizName = await Input.prompt({
			message: 'How should the quiz be named?',
			minLength: 1,
			maxLength: 100,
		});

		UI.clear();
		UI.prompt('Creating quiz...');
		await UI.pause(2);
		UI.clear();
		UI.prompt('Quiz created!');
		const quizId = await Quiz.create(this.user.id, quizName);
		await UI.pause(2);

		return new EditQuizState(this.user, quizId);
	}
}

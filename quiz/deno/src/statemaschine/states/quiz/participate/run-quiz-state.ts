import { Quiz } from '@src/quiz/quiz.ts';
import { IState } from '@states/state.ts';
import { InitState } from '@states/init-state.ts';
import { keypress } from '@cliffy/keypress/mod.ts';

export class RunQuizState implements IState {
	constructor(private readonly quiz: Quiz) {}

	async run() {
		const questions = this.quiz.questions;

		const answers = new Map<string, boolean>();

		for (const question of questions) {
			const answer = await question.ask();
			if (question.checkAnswer(answer)) {
				console.log(
					'%cCorrect!',
					'color: #0f0; font-weight: bold;',
				);
				answers.set(question.id, true);
			} else {
				console.log(
					'%cWrong!',
					'color: #f00; font-weight: bold;',
				);
				answers.set(question.id, false);
			}
			console.log('Press any key to continue...');
			await keypress();
		}

		this.quiz.addResponse(answers);
		await this.quiz.save();

		return new InitState();
	}
}

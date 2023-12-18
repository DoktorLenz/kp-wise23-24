import { Quiz } from '@src/quiz/quiz.ts';
import { IState } from '@states/state.ts';
import { InitState } from '@states/init-state.ts';
import { keypress } from '@cliffy/keypress/mod.ts';
import { UI } from '@src/utils.ts';

export class RunQuizState implements IState {
	constructor(private readonly quiz: Quiz) {}

	async run() {
		const questions = this.quiz.questions;

		const answers = new Map<string, boolean>();

		for (const question of questions) {
			const answer = await question.ask();
			if (question.checkAnswer(answer)) {
				await UI.prompt(
					'%cCorrect!',
					'color: #0f0; font-weight: bold;',
				);
				answers.set(question.id, true);
			} else {
				await UI.prompt(
					'%cWrong!',
					'color: #f00; font-weight: bold;',
				);
				answers.set(question.id, false);
			}
			await UI.prompt('Press any key to continue...');
			await keypress();
		}

		this.quiz.addResponse(answers);
		await this.quiz.save();

		return new InitState();
	}
}

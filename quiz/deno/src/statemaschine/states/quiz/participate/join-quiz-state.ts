import { IState } from '@states/state.ts';
import { Input } from '@cliffy/prompt/mod.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { User } from '@src/user.ts';
import { keypress } from '@cliffy/keypress/mod.ts';
import { RunQuizState } from '@states/quiz/participate/run-quiz-state.ts';
import { UI } from '@src/utils.ts';

export class JoinQuizState implements IState {
	async run(): Promise<IState> {
		const availableShareCodes = await Quiz.availableShareCodes();

		const shareCode = await Input.prompt({
			message: 'Enter the share code:',
			validate: (shareCode) => {
				if (!availableShareCodes.includes(shareCode)) {
					return 'Invalid share code';
				}
				return true;
			},
		});

		const quiz = await Quiz.getQuizByShareCode(shareCode);
		const username = await User.getUsernameById(quiz?.userId ?? '');

		if (!quiz || !username) {
			throw new Error('Invalid quiz or user');
		}

		UI.clear();

		UI.prompt(
			`%cWelcome to '${quiz.name}' by '${username}`,
			'color: #00f; font-weight: bold;',
		);
		if (quiz.description) {
			UI.prompt(quiz.description);
		}
		UI.prompt();
		UI.prompt('Press any key to start the quiz');
		await keypress();

		return new RunQuizState(quiz);
	}
}

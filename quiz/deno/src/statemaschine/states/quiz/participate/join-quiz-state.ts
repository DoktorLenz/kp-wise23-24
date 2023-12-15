import { IState } from '@states/state.ts';
import { Input } from '@cliffy/prompt/mod.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { InitState } from '@states/init-state.ts';
import { User } from '@src/user.ts';
import { clearConsole } from '@src/utils.ts';
import { keypress } from '@cliffy/keypress/mod.ts';

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

		clearConsole();

		console.log(
			`%cWelcome to '${quiz.name}' by '${username}`,
			'color: #00f; font-weight: bold;',
		);
		if (quiz.description) {
			console.log(quiz.description);
		}
		console.log();
		console.log('Press any key to start the quiz');
		await keypress();

		return new InitState();
	}
}

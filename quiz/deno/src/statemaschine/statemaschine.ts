import { InitState } from '@states/init-state.ts';
import { IState } from '@states/state.ts';
import { clearConsole } from '@src/utils.ts';
import { User } from '@src/user.ts';
import { EditQuizState } from './states/quiz/manage/edit-quiz-state.ts';
import { Question } from '@src/quiz/question.ts';
import { Quiz } from '@src/quiz/quiz.ts';

export class StateMaschine {
	private state: IState = new InitState();

	public async start() {
		// const user = await User.checkLogin('admin', '123456789');
		// const quiz = await Quiz.getQuizById(
		// 	user,
		// 	'1a43913c-0289-4687-ba54-def877768eb3',
		// );
		// this.state = new EditQuizState(user, quiz);

		while (this.state) {
			clearConsole();
			this.state = await this.state.run();
		}
	}
}

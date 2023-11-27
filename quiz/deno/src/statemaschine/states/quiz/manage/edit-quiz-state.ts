import { User } from '@src/user.ts';
import { IState } from '@states/state.ts';
import { ManageQuizzesState } from '@states/quiz/manage/manage-quizzes-state.ts';

export class EditQuizState implements IState {
	constructor(
		private readonly user: User,
		private readonly quizName: string,
	) {}

	async run() {
		return new ManageQuizzesState(this.user);
	}
}

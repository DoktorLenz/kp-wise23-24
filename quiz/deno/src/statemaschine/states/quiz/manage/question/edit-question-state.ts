import { IState } from '@states/state.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { User } from '@src/user.ts';
import { Question } from '@src/quiz/question.ts';
import { EditQuizState } from '../edit-quiz-state.ts';

export class EditQuestionState implements IState {
	constructor(
		private readonly user: User,
		private readonly quiz: Quiz,
		private readonly question: Question<unknown>,
	) {}

	async run(): Promise<IState> {
		await this.question.edit();
		return new EditQuizState(this.user, this.quiz);
	}
}

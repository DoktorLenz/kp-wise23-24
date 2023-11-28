import { IState } from '@states/state.ts';
import { User } from '@src/user.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { OnEditQuizState } from '../on-edit-quiz-state.ts';
import { Select } from '@cliffy/prompt/mod.ts';
import { ToggleQuestion } from '@src/quiz/question.ts';
import { EditQuestionState } from '@states/quiz/manage/question/edit-question-state.ts';

export class AddQuestionState implements IState {
	constructor(private readonly user: User, private readonly quiz: Quiz) {}

	async run(): Promise<IState> {
		enum Action {
			Toggle = 'toggle',
			MultipleChoice = 'multiplechoice',
			MultipleAnswer = 'multipleanswer',
			Open = 'open',
		}

		const question = await Select.prompt({
			message: 'What type of question do you want to add?',
			options: [
				{
					name: 'True/False',
					value: Action.Toggle,
				},
				{
					name: 'Multiple Choice',
					value: Action.MultipleChoice,
				},
				{
					name: 'Multiple Answer',
					value: Action.MultipleAnswer,
				},
				{
					name: 'Open',
					value: Action.Open,
				},
			],
		});

		switch (question) {
			case Action.Toggle: {
				const question = this.quiz.addQuestion(
					ToggleQuestion.create(),
				);
				return new EditQuestionState(
					this.user,
					this.quiz,
					question,
				);
			}
			case Action.MultipleChoice:
				break;
			case Action.MultipleAnswer:
				break;
			case Action.Open:
				break;
		}

		return new OnEditQuizState(this.user, this.quiz);
	}
}

import { IState } from '@states/state.ts';
import { User } from '@src/user.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { OnEditQuizState } from '../on-edit-quiz-state.ts';
import { Select } from '@cliffy/prompt/mod.ts';
import { TrueFalseQuestion } from '@src/quiz/question.ts';

export class AddQuestionState implements IState {
	constructor(private readonly user: User, private readonly quiz: Quiz) {}

	async run(): Promise<IState> {
		enum Action {
			TrueFalse = 'truefalse',
			MultipleChoice = 'multiplechoice',
			MultipleAnswer = 'multipleanswer',
			Open = 'open',
		}

		const question = await Select.prompt({
			message: 'What type of question do you want to add?',
			options: [
				{
					name: 'True/False',
					value: Action.TrueFalse,
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
			case Action.TrueFalse:
				this.quiz.addQuestion(
					TrueFalseQuestion.create(
						'This is a true/false question',
						'This is the description of the question',
						true,
						'This is the true answer',
						'This is the false answer',
					),
				);
				break;
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

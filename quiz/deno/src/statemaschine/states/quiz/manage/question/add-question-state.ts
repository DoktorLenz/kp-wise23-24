import { IState } from '@states/state.ts';
import { User } from '@src/user.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { EditQuizState } from '../edit-quiz-state.ts';
import { Select } from '@cliffy/prompt/mod.ts';
import { EditQuestionState } from '@states/quiz/manage/question/edit-question-state.ts';
import { ToggleQuestion } from '@src/quiz/toggle-question.ts';
import { MultipleChoiceQuestion } from '@src/quiz/multiple-choice-question.ts';

export class AddQuestionState implements IState {
	constructor(private readonly user: User, private readonly quiz: Quiz) {}

	async run(): Promise<IState> {
		enum Action {
			Toggle = 'toggle',
			MultipleChoice = 'multiplechoice',
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
			case Action.MultipleChoice: {
				const question = this.quiz.addQuestion(
					MultipleChoiceQuestion.create(),
				);
				return new EditQuestionState(
					this.user,
					this.quiz,
					question,
				);
			}
			case Action.Open:
				break;
		}

		return new EditQuizState(this.user, this.quiz);
	}
}

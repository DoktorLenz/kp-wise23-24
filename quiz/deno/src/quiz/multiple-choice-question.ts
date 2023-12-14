import { Question } from '@src/quiz/question.ts';
import { inherits, model, property } from '@decoverto';
import { Checkbox, List } from '@cliffy/prompt/mod.ts';

export type Choice = { name: string; value: string; checked: boolean };

@inherits({ discriminator: 'MultipleChoiceQuestion' })
@model()
export class MultipleChoiceQuestion extends Question<string[]> {
	// @property()
	choices: Choice[] = [];

	static create(): MultipleChoiceQuestion {
		return new MultipleChoiceQuestion(
			crypto.randomUUID(),
		);
	}

	checkAnswer(answer: string[]): boolean {
		return false;
	}

	override ask(): Promise<string[]> {
		this.printTitle();
		return Checkbox.prompt<string>({
			message: this.description ?? '',
			options: this.choices,
		});
	}

	override async edit(): Promise<void> {
		await super.edit();

		let newChoices = await List.prompt({
			message: 'Please enter the choices separated by a comma',
			minTags: 2,
			default: this.choices.map((choice) => choice.name),
		});

		this.choices = this.choices.filter((choice) =>
			newChoices.includes(choice.name)
		);
		newChoices = newChoices.filter((choice) =>
			!this.choices.map((choice) => choice.name).includes(
				choice,
			)
		);

		this.choices.push(...newChoices.map((choice) => {
			return {
				name: choice,
				value: crypto.randomUUID(),
				checked: false,
			};
		}));

		const checkedChoices: string[] = await Checkbox.prompt<string>({
			message: this.title ?? '',
			options: this.choices,
			default: this.choices.filter((choice) => choice.checked)
				.map((choice) => choice.value),
		});

		this.choices = this.choices.map((choice) => {
			return {
				...choice,
				checked: checkedChoices.includes(choice.value),
			};
		});

		console.log(this.choices);
	}

	get solutionText(): string {
		return '';
	}
}

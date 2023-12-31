import { inherits, model, property } from '@decoverto';
import { Question } from '@src/quiz/question.ts';
import { Input, Toggle } from '@cliffy/prompt/mod.ts';

@inherits({ discriminator: 'ToggleQuestion' })
@model()
export class ToggleQuestion extends Question<boolean> {
	@property({
		toInstance: (value: string | undefined) => value,
		toPlain: (value: string | undefined) =>
			value === '' ? undefined : value,
	})
	trueText?: string;
	@property({
		toInstance: (value: string | undefined) => value,
		toPlain: (value: string | undefined) =>
			value === '' ? undefined : value,
	})
	falseText?: string;

	get solutionText(): string {
		return (this.solution ? this.trueText : this.falseText) ?? '';
	}

	protected constructor(
		id: string,
		title?: string,
		description?: string,
		solution?: boolean,
		trueText?: string,
		falseText?: string,
	) {
		super(id, title, description, solution);
		this.trueText = trueText;
		this.falseText = falseText;
	}

	static create(): ToggleQuestion {
		return new ToggleQuestion(
			crypto.randomUUID(),
		);
	}

	checkAnswer(answer: boolean): boolean {
		return answer === this.solution;
	}

	override async ask(): Promise<boolean> {
		await this.printTitle();
		return Toggle.prompt({
			message: this.description ?? '',
			active: this.trueText ?? 'Yes',
			inactive: this.falseText ?? 'No',
		});
	}

	override async edit(): Promise<void> {
		await super.edit();

		this.trueText = await Input.prompt({
			message: 'Please enter the text for option 1',
			default: this.trueText,
			minLength: 1,
			maxLength: 100,
		});

		this.falseText = await Input.prompt({
			message: 'Please enter the text for option 2',
			default: this.falseText,
			minLength: 1,
			maxLength: 100,
		});

		this.solution = await Toggle.prompt({
			message: this.title ?? '',
			active: this.trueText,
			inactive: this.falseText,
			default: this.solution,
		});
	}
}

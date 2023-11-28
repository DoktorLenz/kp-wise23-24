import { Input, Toggle } from '@cliffy/prompt/mod.ts';
import { Any, inherits, model, property } from '@decoverto';
import { clearConsole } from '@src/utils.ts';

@model({
	inheritance: {
		discriminatorKey: '__type',
		strategy: 'discriminator',
	},
})
export abstract class Question<T> {
	@property()
	id: string;

	@property()
	title?: string;

	@property({
		toInstance: (value: string | undefined) => value,
		toPlain: (value: string | undefined) =>
			value === '' ? undefined : value,
	})
	description?: string;

	@property(Any)
	solution?: T;

	protected constructor(
		id: string,
		title?: string,
		description?: string,
		solution?: T,
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.solution = solution;
	}

	abstract checkAnswer(answer: T): boolean;
	abstract ask(): Promise<T>;
	abstract edit(): Promise<void>;
	abstract get solutionText(): string;
}

@inherits({ discriminator: 'ToggleQuestion' })
@model()
export class ToggleQuestion extends Question<boolean> {
	@property()
	trueText?: string;
	@property()
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

	ask(): Promise<boolean> {
		console.log(
			`%c${this.title}`,
			`color: #00f; font-weight: bold;`,
		);
		return Toggle.prompt({
			message: this.description ?? '',
			active: this.trueText ?? 'Yes',
			inactive: this.falseText ?? 'No',
		});
	}

	async edit(): Promise<void> {
		clearConsole();
		this.title = await Input.prompt({
			message: 'Please enter the title of the question',
			default: this.title,
			minLength: 1,
			maxLength: 100,
		});

		this.description = await Input.prompt({
			message: 'Please enter the description of the question',
			default: this.description,
			maxLength: 100,
		});

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
			message: this.title,
			active: this.trueText,
			inactive: this.falseText,
			default: this.solution,
		});
	}
}

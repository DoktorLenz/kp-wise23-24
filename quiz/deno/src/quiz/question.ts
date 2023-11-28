import { Toggle } from '@cliffy/prompt/mod.ts';
import { Any, inherits, model, property } from '@decoverto';

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
	title: string;

	@property()
	description: string;

	@property(Any)
	solution: T;

	protected constructor(
		id: string,
		title: string,
		description: string,
		solution: T,
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.solution = solution;
	}

	abstract checkAnswer(answer: T): boolean;
	abstract ask(): Promise<T>;
	abstract get solutionText(): string;
}

@inherits({ discriminator: 'TrueFalseQuestion' })
@model()
export class TrueFalseQuestion extends Question<boolean> {
	@property()
	trueText: string;
	@property()
	falseText: string;

	get solutionText(): string {
		return this.solution ? this.trueText : this.falseText;
	}

	protected constructor(
		id: string,
		title: string,
		description: string,
		solution: boolean,
		trueText: string = 'Yes',
		falseText: string = 'No',
	) {
		super(id, title, description, solution);
		this.trueText = trueText;
		this.falseText = falseText;
	}

	static create(
		title: string,
		description: string,
		solution: boolean,
		trueText = 'Yes',
		falseText = 'No',
	): TrueFalseQuestion {
		return new TrueFalseQuestion(
			crypto.randomUUID(),
			title,
			description,
			solution,
			trueText,
			falseText,
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
			message: this.description,
			active: this.trueText,
			inactive: this.falseText,
		});
	}
}

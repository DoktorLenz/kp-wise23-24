import { Any, model, property } from '@decoverto';
import { Input } from '@cliffy/prompt/mod.ts';
import { UI } from '@src/utils.ts';

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

	protected printTitle(): void {
		UI.prompt(
			`%c${this.title}`,
			`color: #00f; font-weight: bold;`,
		);
	}

	abstract checkAnswer(answer: T): boolean;
	abstract ask(): Promise<T>;

	async edit(): Promise<void> {
		UI.clear();
		this.title = await Input.prompt({
			message: 'Please enter the title of the question',
			default: this.title,
			minLength: 1,
			maxLength: 100,
		});

		this.description = await Input.prompt({
			message: 'Please enter the description of the question',
			default: this.description,
			hideDefault: this.description === '',
			maxLength: 100,
		});
	}

	abstract get solutionText(): string;
}

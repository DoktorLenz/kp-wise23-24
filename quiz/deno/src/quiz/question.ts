import { Any, model, property } from '@decoverto';

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

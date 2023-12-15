import { Question } from '@src/quiz/question.ts';
import { array, inherits, map, MapShape, model, property } from '@decoverto';
import { Checkbox, List } from '@cliffy/prompt/mod.ts';

type Option = { name: string; value: string };

@inherits({ discriminator: 'MultipleChoiceQuestion' })
@model()
export class MultipleChoiceQuestion extends Question<string[]> {
	/**
	 * The options for this question
	 *
	 * key: text
	 *
	 * value: id
	 */
	@property(array(() => String))
	options?: string[];

	protected constructor(
		id: string,
		title?: string,
		description?: string,
		solution?: string[],
		options?: string[],
	) {
		super(id, title, description, solution);
		this.options = options;
	}

	static create(): MultipleChoiceQuestion {
		return new MultipleChoiceQuestion(
			crypto.randomUUID(),
		);
	}

	ask(): Promise<string[]> {
		this.printTitle();
		return Checkbox.prompt<string>({
			message: this.description ?? '',
			options: this.options ?? [],
		});
	}

	checkAnswer(answer: string[]): boolean {
		const shouldBeAnswered = this.solution ?? [];

		const wrongs = answer.filter((id) =>
			!shouldBeAnswered.includes(id)
		).concat(shouldBeAnswered.filter((id) => !answer.includes(id)));

		return wrongs.length === 0;
	}

	override async edit(): Promise<void> {
		await super.edit();

		this.options = await List.prompt({
			message: 'Please enter the choices separated by a comma',
			minTags: 2,
			default: this.options,
			hideDefault: this.options?.length === 0,
		});

		this.solution = await Checkbox.prompt<string>({
			message: this.title ?? '',
			options: this.options,
			default: this.solution,
		});
	}

	get solutionText(): string {
		return this.solution?.join(', ') ?? '';
	}
}

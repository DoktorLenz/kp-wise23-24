import { Question } from '@src/quiz/question.ts';
import { inherits, map, MapShape, model, property } from '@decoverto';
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
	@property(map(() => String, () => String, { shape: MapShape.Array }))
	options: Map<string, string>;

	protected constructor(
		id: string,
		title?: string,
		description?: string,
		solution?: string[],
		options?: Map<string, string>,
	) {
		super(id, title, description, solution);
		this.options = options ?? new Map();
	}

	static create(): MultipleChoiceQuestion {
		return new MultipleChoiceQuestion(
			crypto.randomUUID(),
		);
	}

	ask(): Promise<string[]> {
		throw new Error('Method not implemented.');
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

		const newOptions: string[] = await List.prompt({
			message: 'Please enter the choices separated by a comma',
			minTags: 2,
			default: Array.from(this.options.keys()),
		});

		const removedOptions = Array.from(this.options.values()).filter(
			(option) => !newOptions.includes(option),
		);

		removedOptions.forEach((option) => {
			this.options.delete(option);
		});

		newOptions.forEach((newOption) => {
			if (!this.options.has(newOption)) {
				this.options.set(
					newOption,
					crypto.randomUUID(),
				);
			}
		});

		this.solution = await Checkbox.prompt<string>({
			message: this.title ?? '',
			options: Array.from(this.options).map((
				[name, value],
			) => ({ name, value })),
			default: this.solution,
		});
	}

	get solutionText(): string {
		return '';
	}
}

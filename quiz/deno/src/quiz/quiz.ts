import { User } from '@src/user.ts';
import { dataDir } from '@src/utils.ts';
import { Question } from '@src/quiz/question.ts';
import { array, Decoverto, model, property } from '@decoverto';

@model()
export class Quiz {
	@property()
	id: string;

	@property()
	userId: string;

	@property()
	name: string;

	@property({
		toInstance: (value: string | undefined) => value,
		toPlain: (value: string | undefined) =>
			value === '' ? undefined : value,
	})
	description?: string;

	@property(array(() => Question))
	questions: Question<unknown>[] = [];

	private constructor(
		id: string,
		userId: string,
		name: string,
	) {
		this.id = id;
		this.userId = userId;
		this.name = name;
	}

	public async delete(): Promise<Quiz[]> {
		const quizzes = await Quiz.getAllQuizzes();
		const index = quizzes.findIndex((quiz) => quiz.id === this.id);

		quizzes.splice(index, 1);
		Quiz.saveAllQuizzes(quizzes);
		return quizzes;
	}

	public addQuestion(question: Question<unknown>): Question<unknown> {
		this.questions.push(question);
		return question;
	}

	public removeQuestion(id: string): void {
		this.questions = this.questions.filter((question) =>
			question.id !== id
		);
	}

	public async save(): Promise<void> {
		const quizzes = await Quiz.getAllQuizzes();
		const index = quizzes.findIndex((quiz) => quiz.id === this.id);

		if (index === -1) {
			quizzes.push(this);
		} else {
			quizzes[index] = this;
		}
		Quiz.saveAllQuizzes(quizzes);
	}

	static isAnyQuizRegistered(user: User): Promise<boolean> {
		return this.getAllQuizzesForUser(user).then((quizzes) =>
			quizzes.length > 0
		);
	}

	private static async saveAllQuizzes(quizzes: Quiz[]): Promise<void> {
		const encoder = new TextEncoder();
		const decoverto = new Decoverto();

		const raw = decoverto.type(Quiz).instanceArrayToRaw(quizzes);
		await Deno.mkdir(dataDir, { recursive: true });

		await Deno.writeFile(
			`${dataDir}/quizzes.json`,
			encoder.encode(raw),
			{ create: true },
		);
	}

	private static async getAllQuizzes(): Promise<Quiz[]> {
		const decoder = new TextDecoder();
		const decoverto = new Decoverto();

		try {
			const content = await Deno.readFile(
				`${dataDir}/quizzes.json`,
			);
			const quizzes = decoverto.type(Quiz).rawToInstanceArray(
				decoder.decode(content),
			);
			return quizzes;
		} catch (_error) {
			return [];
		}
	}

	public static async create(user: User, name: string): Promise<Quiz> {
		const quizzes = await this.getAllQuizzes();
		const quiz = new Quiz(crypto.randomUUID(), user.id, name);

		quizzes.push(quiz);
		this.saveAllQuizzes(quizzes);
		return quiz;
	}

	public static async getAllQuizzesForUser(user: User): Promise<Quiz[]> {
		return (await this.getAllQuizzes()).filter((quiz) =>
			quiz.userId === user.id
		);
	}

	public static async getQuizById(user: User, id: string): Promise<Quiz> {
		const quizzes = await this.getAllQuizzes();
		const quiz = quizzes.find((quiz) =>
			quiz.id === id && quiz.userId === user.id
		);

		if (!quiz) {
			throw new Error(`Acces Violation`);
		}

		return quiz;
	}
}

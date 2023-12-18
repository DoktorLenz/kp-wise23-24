import { User } from '@src/user.ts';
import { dataDir } from '@src/utils.ts';
import { Question } from '@src/quiz/question.ts';
import {
	Any,
	array,
	Decoverto,
	map,
	MapShape,
	model,
	property,
} from '@decoverto';
import { crypto } from 'https://deno.land/std/crypto/mod.ts';

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

	@property()
	shareCode: string;

	@property(
		map(
			() => String,
			map(() => String, () => Boolean, {
				shape: MapShape.Object,
			}),
			{ shape: MapShape.Object },
		),
	)
	private responses: Map<string, Map<string, boolean>>;

	private constructor(
		id: string,
		userId: string,
		name: string,
		shareCode?: string,
		responses?: Map<string, Map<string, boolean>>,
	) {
		this.id = id;
		this.userId = userId;
		this.name = name;
		this.shareCode = shareCode ?? this.getShareCode();
		this.responses = responses ?? new Map();
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

	public addResponse(answers: Map<string, boolean>): void {
		this.responses.set(crypto.randomUUID(), answers);
	}

	public getResponsesCount(): number {
		return this.responses.size;
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

	private getShareCode(): string {
		const encoder = new TextEncoder();
		const hashBuffer = crypto.subtle.digestSync(
			'SHA-256',
			encoder.encode(this.id),
		);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((b) =>
			b.toString(16).padStart(2, '0')
		).join('').substring(0, 8);
		return parseInt(hashHex, 16).toString(36);
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

	public static async getQuizByShareCode(
		shareCode: string,
	): Promise<Quiz | undefined> {
		const quizzes = await this.getAllQuizzes();
		const quiz = quizzes.find((quiz) =>
			quiz.shareCode === shareCode
		);
		return quiz;
	}

	public static async availableShareCodes(): Promise<string[]> {
		const quizzes = await this.getAllQuizzes();
		return quizzes.map((quiz) => quiz.shareCode);
	}
}

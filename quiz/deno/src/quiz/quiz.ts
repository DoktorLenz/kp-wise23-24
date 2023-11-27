import "npm:reflect-metadata";
import { jsonMember, jsonObject, TypedJSON } from "npm:typedjson@1.8.0";
import { dataDir } from "../utils.ts";
import { User } from "../user.ts";

@jsonObject
export class Quiz {
  @jsonMember
  id?: string;

  @jsonMember
  userId?: string;

  @jsonMember
  name?: string;

  private constructor(
    id?: string,
    userId?: string,
    name?: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
  }

  public async delete(): Promise<void> {
    const quizzes = await Quiz.getAllQuizzes();
    const index = quizzes.findIndex((quiz) => quiz.id === this.id);

    quizzes.splice(index, 1);
    Quiz.saveAllQuizzes(quizzes);
  }

  static isAnyQuizRegistered(user: User): Promise<boolean> {
    return this.getAllQuizzesForUser(user).then((quizzes) =>
      quizzes.length > 0
    );
  }

  private static async saveAllQuizzes(quizzes: Quiz[]): Promise<void> {
    const encoder = new TextEncoder();
    const serializer = new TypedJSON(Quiz);

    await Deno.mkdir(dataDir, { recursive: true });

    await Deno.writeFile(
      `${dataDir}/quizzes.json`,
      encoder.encode(serializer.stringifyAsArray(quizzes)),
      { create: true },
    );
  }

  private static async getAllQuizzes(): Promise<Quiz[]> {
    const decoder = new TextDecoder();
    const serializer = new TypedJSON(Quiz);

    try {
      const content = await Deno.readFile(`${dataDir}/quizzes.json`);
      return serializer.parseAsArray(decoder.decode(content));
    } catch (_error) {
      return [];
    }
  }

  public static async create(user: User, name: string): Promise<void> {
    const quizzes = await this.getAllQuizzes();
    const quiz = new Quiz(crypto.randomUUID(), user.id, name);

    quizzes.push(quiz);
    this.saveAllQuizzes(quizzes);
  }

  public static async getAllQuizzesForUser(user: User): Promise<Quiz[]> {
    return (await this.getAllQuizzes()).filter((quiz) =>
      quiz.userId === user.id
    );
  }
}

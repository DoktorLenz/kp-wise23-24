import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { IState } from "../../state.ts";
import { Quiz } from "../../../../quiz.ts";
import { User } from "../../../../user.ts";
import { EditQuizState } from "./edit-quiz-state.ts";
import { clearConsole } from "../../../../utils.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";

export class NewQuizState implements IState {
  constructor(private readonly user: User) {}

  async run() {
    const quizName = await Input.prompt({
      message: "How should the quiz be named?",
      minLength: 1,
      maxLength: 100,
    });

    clearConsole();
    console.log("Creating quiz...");
    await sleep(2);
    clearConsole();
    console.log("Quiz created!");
    Quiz.create(this.user, quizName);
    await sleep(2);

    return new EditQuizState(this.user, quizName);
  }
}

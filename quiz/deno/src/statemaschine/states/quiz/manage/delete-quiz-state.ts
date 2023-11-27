import {
  Select,
  SelectOption,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { IState } from "../../state.ts";
import { Quiz } from "../../../../quiz/quiz.ts";
import { User } from "../../../../user.ts";
import { ManageQuizzesState } from "./manage-quizzes-state.ts";
import { clearConsole } from "../../../../utils.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";

export class DeleteQuizState implements IState {
  constructor(private readonly user: User) {}

  async run() {
    const options: (SelectOption<Quiz | null>)[] =
      (await Quiz.getAllQuizzesForUser(this.user)).map((quiz) => {
        return { name: quiz.name, value: quiz };
      });

    // insert one option at first position in the options array
    options.unshift({ name: "[Back]", value: null });

    const quiz = await Select.prompt({
      message: "Which quiz should be deleted?",
      options: options,
      maxRows: 10,
      search: true,
      searchLabel: "Search for quiz",
    });

    if (quiz !== null) {
      clearConsole();
      console.log("Deleting quiz...");
      await sleep(2);
      clearConsole();
      console.log("Quiz deleted!");
      await quiz.delete();
      await sleep(2);
    }

    return new ManageQuizzesState(this.user);
  }
}

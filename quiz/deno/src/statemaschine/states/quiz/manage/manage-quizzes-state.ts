import {
  Select,
  SelectOption,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { Quiz } from "../../../../quiz.ts";
import { LoggedInState } from "../../logged-in/logged-in-state.ts";
import { User } from "../../../../user.ts";

export class ManageQuizzesState {
  constructor(private readonly user: User) {
  }

  async run() {
    enum Action {
      New = "new",
      Edit = "edit",
      Delete = "delete",
      Back = "back",
    }

    const options: (SelectOption<Action>)[] = [];
    options.push({ name: "New Quiz", value: Action.New });
    if (await Quiz.isAnyQuizRegistered()) {
      options.push({ name: "Edit Quiz", value: Action.Edit });
      options.push({ name: "Delete Quiz", value: Action.Delete });
    }
    options.push({ name: "Back", value: Action.Back });

    const action: string = await Select.prompt({
      "message": "Manage Quizzes",
      "options": options,
    });

    switch (action) {
      case Action.New:
      case Action.Edit:
      case Action.Delete:
        break;
      case Action.Back:
        return new LoggedInState(this.user);
    }

    return new ManageQuizzesState(this.user);
  }
}

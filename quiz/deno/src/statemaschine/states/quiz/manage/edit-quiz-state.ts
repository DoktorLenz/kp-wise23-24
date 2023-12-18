import { User } from '@src/user.ts';
import { IState } from '@states/state.ts';
import { ManageQuizzesState } from '@states/quiz/manage/manage-quizzes-state.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { Cell, Table, TableType } from '@cliffy/table/mod.ts';
import { Row, RowType } from '@cliffy/table/row.ts';
import { keypress } from '@cliffy/keypress/mod.ts';
import { bold } from '@cliffy/prompt/deps.ts';
import { tty } from '@cliffy/ansi/tty.ts';
import { AddQuestionState } from '@states/quiz/manage/question/add-question-state.ts';
import { EditQuestionState } from '@states/quiz/manage/question/edit-question-state.ts';
import { UI } from '@src/utils.ts';

export class EditQuizState implements IState {
	constructor(
		private readonly user: User,
		private readonly quiz: Quiz,
	) {}

	async run() {
		let carretIndex = 0;
		let questioncount = this.quiz.questions.length;

		tty.cursorTo(0, 0);
		await this.renderTable(this.quiz, carretIndex);

		for await (const event of keypress()) {
			if (event.key === 'up') {
				tty.cursorLeft.eraseDown();
				carretIndex = carretIndex === 0
					? questioncount - 1
					: carretIndex - 1;
				await this.renderTable(this.quiz, carretIndex);
			} else if (event.key === 'down') {
				tty.cursorLeft.eraseDown();
				carretIndex = carretIndex === questioncount - 1
					? 0
					: carretIndex + 1;
				await this.renderTable(this.quiz, carretIndex);
			} else if (event.key === '+') {
				return new AddQuestionState(
					this.user,
					this.quiz,
				);
			} else if (event.key === '-') {
				if (questioncount === 0) {
					continue;
				}
				this.quiz.removeQuestion(
					this.quiz.questions[carretIndex].id,
				);
				questioncount = this.quiz.questions.length;
				if (carretIndex >= questioncount) {
					carretIndex = questioncount - 1;
				}
				await this.renderTable(this.quiz, carretIndex);
			} else if (event.key === 'return') {
				return new EditQuestionState(
					this.user,
					this.quiz,
					this.quiz.questions[carretIndex],
				);
			} else if (event.key === 'escape') {
				UI.clear();
				UI.prompt('Saving quiz...');
				await UI.pause(2);
				UI.clear();
				UI.prompt('Quiz saved!');
				await this.quiz.save();
				await UI.pause(2);
				break;
			} else if (event.ctrlKey && event.key === 'c') {
				Deno.exit(0);
			}
		}

		return new ManageQuizzesState(this.user);
	}

	private async renderTable(
		quiz: Quiz,
		carretIndex: number,
	): Promise<void> {
		tty.cursorLeft.eraseDown();
		const bodyContent: TableType<RowType> = [];

		quiz.questions.forEach((question, index) => {
			bodyContent.push([
				`${index === carretIndex ? '>' : ' '}`,
				question.title,
				question.description,
				question.solutionText,
			]);
		});

		bodyContent.push([
			new Cell(
				'[+] Add Question \r\n [-] Delete Question \r\n [Enter] Edit Question \r\n [Esc] Back',
			).colSpan(4).align('center').border(false),
		]);

		new Table()
			.header(
				new Row(
					' ',
					bold('Question'),
					bold('Description'),
					bold('Solution'),
				),
			)
			.body(bodyContent)
			.padding(1)
			.indent(2)
			.border()
			.render();

		tty.cursorUp(quiz.questions.length + 1);
		tty.cursorTo(0, 0);
	}
}

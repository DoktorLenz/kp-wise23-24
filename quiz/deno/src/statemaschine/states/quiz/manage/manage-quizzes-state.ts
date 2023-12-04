import { Quiz } from '@src/quiz/quiz.ts';
import { User } from '@src/user.ts';
import { IState } from '@states/state.ts';
import { tty } from '@cliffy/ansi/tty.ts';
import { RowType, Table, TableType } from '@cliffy/table/mod.ts';
import { Cell } from '@cliffy/table/cell.ts';
import { Row } from '@cliffy/table/row.ts';
import { keypress, KeyPressEvent } from '@cliffy/keypress/mod.ts';
import { LoggedInState } from '@states/logged-in/logged-in-state.ts';
import { NewQuizState } from '@states/quiz/manage/new-quiz-state.ts';
import { EditQuizState } from './edit-quiz-state.ts';

export class ManageQuizzesState implements IState {
	constructor(private readonly user: User) {
	}

	async run() {
		let carretIndex = 0;
		let quizzes = await Quiz.getAllQuizzesForUser(this.user);

		tty.cursorTo(0, 0);
		await this.renderTable(quizzes, carretIndex);

		for await (const event of keypress()) {
			if (event.key === 'up') {
				tty.cursorLeft.eraseDown();
				carretIndex = carretIndex === 0
					? quizzes.length - 1
					: carretIndex - 1;
				await this.renderTable(quizzes, carretIndex);
			} else if (event.key === 'down') {
				tty.cursorLeft.eraseDown();
				carretIndex = carretIndex === quizzes.length - 1
					? 0
					: carretIndex + 1;
				await this.renderTable(quizzes, carretIndex);
			} else if (event.key === '+') {
				return new NewQuizState(this.user);
			} else if (event.key === '-') {
				if (quizzes.length === 0) {
					continue;
				}
				quizzes = await quizzes[carretIndex].delete();
				if (carretIndex >= quizzes.length) {
					carretIndex = quizzes.length - 1;
				}
				await this.renderTable(quizzes, carretIndex);
			} else if (event.key === 'return') {
				return new EditQuizState(
					this.user,
					quizzes[carretIndex],
				);
			} else if (event.key === 'escape') {
				break;
			} else if (event.ctrlKey && event.key === 'c') {
				Deno.exit(0);
			}
		}

		return new LoggedInState(this.user);
	}

	private async renderTable(
		quizzes: Quiz[],
		carretIndex: number,
	) {
		tty.cursorLeft.eraseDown();
		const bodyContent: TableType<RowType> = [];

		quizzes.forEach((quiz, index) => {
			bodyContent.push([
				`${index === carretIndex ? '>' : ' '}`,
				quiz.name,
				quiz.description,
				quiz.questions.length.toString(),
			]);
		});

		bodyContent.push([
			new Cell(
				'[+] Add Quiz \r\n [-] Delete Quiz \r\n [Enter] Edit Quiz \r\n [Esc] Back',
			).colSpan(4).align('center').border(false),
		]);

		new Table()
			.header(
				new Row(
					' ',
					'Quiz-Name',
					'Description',
					'Questioncount',
				),
			)
			.body(bodyContent)
			.padding(1)
			.indent(2)
			.border()
			.render();

		tty.cursorUp(quizzes.length + 1);
		tty.cursorTo(0, 0);
	}
}

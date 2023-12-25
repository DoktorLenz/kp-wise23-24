import {
	afterEach,
	beforeEach,
	describe,
	it,
} from 'https://deno.land/std@0.208.0/testing/bdd.ts';

// @deno-types="npm:@types/chai@4.3.11"
import chai from 'npm:chai@4.3.10';

// @deno-types="npm:@types/sinon@17.0.2"
import sinon from 'npm:sinon@17.0.1';
import { TypeHandler } from '@decoverto';
import { FS } from '@src/utils.ts';
import { Quiz } from '@src/quiz/quiz.ts';
import { ToggleQuestion } from '@src/quiz/toggle-question.ts';
import { MultipleChoiceQuestion } from '@src/quiz/multiple-choice-question.ts';

const expect = chai.expect;

describe('Quiz', () => {
	let sandbox: sinon.SinonSandbox;
	let quizTypeHandlerStub: sinon.SinonStub;

	beforeEach(() => {
		sandbox = sinon.createSandbox();

		sandbox.stub(FS, 'readFile').resolves(new Uint8Array());
		sandbox.stub(FS, 'writeFile').resolves();

		quizTypeHandlerStub = sandbox.stub(
			TypeHandler.prototype,
			'instanceArrayToRaw',
		).returns('');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('delete', () => {
		it('should delete the quiz and return the updated list of quizzes', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz = await Quiz.create(userId, quizName);

			const getAllQuizzesStub = sandbox.stub(
				Quiz,
				<any> 'getAllQuizzes',
			).resolves([quiz]);

			const result = await quiz.delete();

			expect(result).to.deep.equal([]);
			expect(getAllQuizzesStub.calledOnce).to.be.true;
			expect(quizTypeHandlerStub.secondCall.calledWith([])).to
				.be.true;
		});
	});

	describe('addQuestion', () => {
		it('should add a question to the quiz', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz = await Quiz.create(userId, quizName);
			const question = ToggleQuestion.create();

			const result = quiz.addQuestion(question);

			expect(result).to.equal(question);
			expect(quiz.questions).to.deep.equal([question]);
		});
	});

	describe('removeQuestion', () => {
		it('should remove a question from the quiz', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const question1 = ToggleQuestion.create();
			const question2 = MultipleChoiceQuestion.create();
			const quiz = await Quiz.create(userId, quizName);
			quiz.questions = [question1, question2];

			quiz.removeQuestion(quiz.questions[0].id);

			expect(quiz.questions).to.deep.equal([question2]);
		});
	});

	describe('addResponse', () => {
		it('should add a response to the quiz', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz = await Quiz.create(userId, quizName);
			const answers = new Map<string, boolean>([['1', true], [
				'2',
				false,
			]]);

			quiz.addResponse(answers);

			expect(quiz.responses.size).to.equal(1);
			expect(quiz.responses.entries).to.contain(answers);
		});
	});

	describe('getResponsesCount', () => {
		it('should return the number of responses for the quiz', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz = await Quiz.create(userId, quizName);
			quiz.responses = new Map<string, Map<string, boolean>>([
				['response1', new Map<string, boolean>()],
				['response2', new Map<string, boolean>()],
			]);

			const result = quiz.getResponsesCount();

			expect(result).to.equal(2);
		});
	});

	describe('save', () => {
		it('should save the quiz and update the list of quizzes', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz = await Quiz.create(userId, quizName);

			const getAllQuizzesStub = sandbox.stub(
				Quiz,
				<any> 'getAllQuizzes',
			).resolves([]);

			await quiz.save();

			expect(getAllQuizzesStub.calledOnce).to.be.true;
			expect(quizTypeHandlerStub.alwaysCalledWith([quiz])).to
				.be
				.true;
		});
	});

	describe('getQuizByShareCode', () => {
		it('should return the quiz with the given share code', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz1 = await Quiz.create(
				userId,
				quizName,
			);
			const quiz2 = await Quiz.create(
				userId,
				quizName,
			);

			const getAllQuizzesStub = sandbox.stub(
				Quiz,
				<any> 'getAllQuizzes',
			).resolves([quiz1, quiz2]);

			const result = await Quiz.getQuizByShareCode(
				quiz1.shareCode,
			);

			expect(result).to.equal(quiz1);
			expect(getAllQuizzesStub.calledOnce).to.be.true;
		});

		it('should return undefined if the quiz with the given share code is not found', async () => {
			const shareCode = '$ASDFGHJ';
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz1 = await Quiz.create(
				userId,
				quizName,
			);

			const getAllQuizzesStub = sandbox.stub(
				Quiz,
				<any> 'getAllQuizzes',
			).resolves([quiz1]);

			const result = await Quiz.getQuizByShareCode(shareCode);

			expect(result).to.be.undefined;
			expect(getAllQuizzesStub.calledOnce).to.be.true;
		});
	});

	describe('availableShareCodes', () => {
		it('should return an array of available share codes', async () => {
			const userId = '67dab95b-b90f-4fad-a33a-ed47fc14b68f';
			const quizName = 'Test Quiz';
			const quiz1 = await Quiz.create(
				userId,
				quizName,
			);
			const quiz2 = await Quiz.create(
				userId,
				quizName,
			);

			const getAllQuizzesStub = sandbox.stub(
				Quiz,
				<any> 'getAllQuizzes',
			).resolves([quiz1, quiz2]);

			const result = await Quiz.availableShareCodes();

			expect(result).to.deep.equal([
				quiz1.shareCode,
				quiz2.shareCode,
			]);
			expect(getAllQuizzesStub.calledOnce).to.be.true;
		});
	});
});

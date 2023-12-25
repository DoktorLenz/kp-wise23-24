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

import { MultipleChoiceQuestion } from './multiple-choice-question.ts';
import { UI } from '@src/utils.ts';
import { Checkbox, Input, List } from '@cliffy/prompt/mod.ts';

const expect = chai.expect;

describe('MultipleChoiceQuestion', () => {
	let sandbox: sinon.SinonSandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(UI, 'clear');
		sandbox.stub(UI, 'prompt');
		sandbox.stub(UI, 'pause');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('create', () => {
		it('should create a new multiple choice question', () => {
			const question = MultipleChoiceQuestion.create();

			expect(question).to.be.instanceOf(
				MultipleChoiceQuestion,
			);
			expect(question.id).to.be.a('string');
		});
	});

	describe('ask', () => {
		it('should ask the question with infos from question', async () => {
			const question = MultipleChoiceQuestion.create();
			question.description = 'description';
			question.options = ['option1', 'option2'];

			// Stub the prompt method
			const promptStub = sandbox.stub(Checkbox, 'prompt')
				.resolves([question.options[0]]);

			const result = await question.ask();

			expect(promptStub.calledOnceWith({
				message: 'description',
				options: sinon.match.array.deepEquals(
					question.options,
				),
			})).to.be.true;

			expect(result).to.deep.equal([question.options[0]]);
		});

		it('should ask the question with default values', async () => {
			const question = MultipleChoiceQuestion.create();

			const promptStub = sandbox.stub(Checkbox, 'prompt')
				.resolves([]);

			const result = await question.ask();

			expect(promptStub.calledOnceWith({
				message: '',
				options: [],
			})).to.be.true;

			expect(result).to.deep.equal([]);
		});
	});

	describe('checkAnswer', () => {
		it('should return true when the answer is correct', () => {
			const question = MultipleChoiceQuestion.create();
			question.solution = ['1', '2'];
			expect(question.checkAnswer(['1', '2'])).to.equal(true);
		});

		it('should return false when the answer is incorrect', () => {
			const question = MultipleChoiceQuestion.create();
			question.solution = ['1', '2'];
			expect(question.checkAnswer(['1', '3'])).to.equal(
				false,
			);
		});

		it('should return false when the answer is incomplete', () => {
			const question = MultipleChoiceQuestion.create();
			question.solution = ['1', '2'];
			expect(question.checkAnswer(['1'])).to.equal(false);
		});

		it('should return false when the answer is empty', () => {
			const question = MultipleChoiceQuestion.create();
			question.solution = ['1', '2'];
			expect(question.checkAnswer([])).to.equal(false);
		});

		it('should return false when the solution is undefined', () => {
			const question = MultipleChoiceQuestion.create();
			expect(question.checkAnswer(['1', '2'])).to.equal(
				false,
			);
		});
	});

	describe('edit', () => {
		it('should edit the question', async () => {
			const question = MultipleChoiceQuestion.create();
			const newTitle = 'title';
			const newDescription = 'description';
			const newOptions = ['option1', 'option2'];
			const newSolution = ['option1'];

			const promptStub = sandbox.stub(Input, 'prompt');
			promptStub.onFirstCall().resolves(newTitle);
			promptStub.onSecondCall().resolves(newDescription);

			const listStub = sandbox.stub(List, 'prompt').resolves(
				newOptions,
			);
			const checkboxStub = sandbox.stub(Checkbox, 'prompt')
				.resolves(newSolution);

			await question.edit();

			expect(promptStub.calledTwice).to.be.true;
			expect(listStub.calledOnce).to.be.true;
			expect(checkboxStub.calledOnceWith({
				message: newTitle,
				options: sinon.match.array.deepEquals(
					newOptions,
				),
				default: undefined,
			})).to.be.true;

			// Assert that the title and description were updated
			expect(question.title).to.equal(newTitle);
			expect(question.description).to.equal(newDescription);
			// Assert that the options and solution were updated
			expect(question.options).to.equal(newOptions);
			expect(question.solution).to.equal(newSolution);
		});
	});
});

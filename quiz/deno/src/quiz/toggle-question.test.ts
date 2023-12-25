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

import { ToggleQuestion } from './toggle-question.ts';
import { UI } from '@src/utils.ts';
import { Input, Toggle } from '@cliffy/prompt/mod.ts';

const expect = chai.expect;

describe('ToggleQuestion', () => {
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
		it('should create a new ToggleQuestion instance', () => {
			const question = ToggleQuestion.create();
			expect(question).to.be.instanceOf(ToggleQuestion);
			expect(question.id).to.be.a('string');
		});
	});

	describe('solutionText', () => {
		it('should return the trueText when solution is true', () => {
			const question = ToggleQuestion.create();
			question.solution = true;
			question.trueText = 'Correct';
			question.falseText = 'Not correct';
			expect(question.solutionText).to.equal('Correct');
		});

		it('should return the falseText when solution is false', () => {
			const question = ToggleQuestion.create();
			question.solution = false;
			question.trueText = 'Correct';
			question.falseText = 'Not correct';
			expect(question.solutionText).to.equal('Not correct');
		});

		it('should return an empty string when trueText and falseText are undefined', () => {
			const question = ToggleQuestion.create();
			question.solution = false;
			expect(question.solutionText).to.equal('');
		});
	});

	describe('checkAnswer', () => {
		it('should return true when the answer is correct', () => {
			const question = ToggleQuestion.create();
			question.solution = true;
			expect(question.checkAnswer(true)).to.equal(true);
		});

		it('should return false when the answer is incorrect', () => {
			const question = ToggleQuestion.create();
			question.solution = true;
			expect(question.checkAnswer(false)).to.equal(false);
		});
	});

	describe('ask', () => {
		it('should prompt the user for a boolean answer with infos from question', async () => {
			const question = ToggleQuestion.create();
			question.description = 'Description';
			question.trueText = 'Correct';
			question.falseText = 'Not correct';

			// Stub the prompt method
			const promptStub = sandbox.stub(Toggle, 'prompt')
				.resolves(true);

			const result = await question.ask();

			// Assert that the prompt method was called with the correct arguments
			expect(promptStub.calledOnceWith({
				message: 'Description',
				active: 'Correct',
				inactive: 'Not correct',
			})).to.be.true;

			expect(result).to.be.true;
		});

		it('should prompt the user for a boolean answer with default values', async () => {
			const question = ToggleQuestion.create();

			// Stub the prompt method
			const promptStub = sandbox.stub(Toggle, 'prompt')
				.resolves(true);

			const result = await question.ask();

			// Assert that the prompt method was called with the correct arguments
			expect(promptStub.calledOnceWith({
				message: '',
				active: 'Yes',
				inactive: 'No',
			})).to.be.true;

			expect(result).to.be.true;
		});
	});

	describe('edit', () => {
		it('should update the title, description, trueText, falseText and solution of the question', async () => {
			const question = ToggleQuestion.create();
			const newTitle = 'New Title';
			const newDescription = 'New Description';
			const newTrueText = 'New True Text';
			const newFalseText = 'New False Text';
			const newSolution = false;

			// Stub the Input.prompt method for title, description, trueText and falseText
			const promptStub = sandbox.stub(Input, 'prompt');
			promptStub.onFirstCall().resolves(newTitle);
			promptStub.onSecondCall().resolves(newDescription);
			promptStub.onThirdCall().resolves(newTrueText);
			promptStub.onCall(3).resolves(newFalseText);

			// Stub the Toggle.prompt method for solution
			const toggleStub = sandbox.stub(Toggle, 'prompt')
				.resolves(newSolution);

			await question.edit();

			// Assert that the Toggle.prompt method was called with the correct arguments
			expect(toggleStub.calledOnceWith({
				message: newTitle,
				active: newTrueText,
				inactive: newFalseText,
				default: undefined,
			})).to.be.true;

			// Assert that the title and description were updated
			expect(question.title).to.equal(newTitle);
			expect(question.description).to.equal(newDescription);
			expect(question.trueText).to.equal(newTrueText);
			expect(question.falseText).to.equal(newFalseText);
			expect(question.solution).to.equal(newSolution);
		});
	});
});

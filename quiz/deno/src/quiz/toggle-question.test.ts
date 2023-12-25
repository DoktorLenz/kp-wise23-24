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
});

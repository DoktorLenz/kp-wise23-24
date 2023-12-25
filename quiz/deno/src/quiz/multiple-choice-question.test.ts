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
});

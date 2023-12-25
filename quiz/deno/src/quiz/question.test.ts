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

import { Question } from './question.ts';
import { UI } from '@src/utils.ts';
import { Input } from '@cliffy/prompt/mod.ts';

const expect = chai.expect;

class FakeQuestion extends Question<string> {
	get solutionText(): string {
		return this.solution ?? '';
	}
	checkAnswer(answer: string): boolean {
		return false;
	}

	async ask(): Promise<string> {
		return '';
	}

	static create(): FakeQuestion {
		return new FakeQuestion(
			'',
			'',
			'',
			'',
		);
	}

	titleToConsole(): void {
		this.printTitle();
	}
}

describe('Question', () => {
	let sandbox: sinon.SinonSandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(UI, 'clear');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('edit', () => {
		it('should update the title and description of the question', async () => {
			const question = FakeQuestion.create();
			const newTitle = 'New Title';
			const newDescription = 'New Description';

			// Stub the Input.prompt method for title
			const inputStub = sandbox.stub(Input, 'prompt');
			inputStub.onFirstCall().resolves(newTitle);
			inputStub.onSecondCall().resolves(newDescription);

			await question.edit();

			// Assert that the title and description were updated
			expect(question.title).to.equal(newTitle);
			expect(question.description).to.equal(newDescription);
		});
	});

	describe('printTitle', () => {
		it('should print the title of the question', () => {
			const question = FakeQuestion.create();
			const title = 'Title';
			question.title = title;

			const promptStub = sandbox.stub(UI, 'prompt');

			question.titleToConsole();

			expect(promptStub.calledOnceWithExactly(
				`%c${title}`,
				`color: #00f; font-weight: bold;`,
			)).to.be.true;
		});
	});
});

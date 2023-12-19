import {
	afterEach,
	beforeEach,
	describe,
	it,
} from 'https://deno.land/std@0.208.0/testing/bdd.ts';
import { Input, Secret } from '@cliffy/prompt/mod.ts';

// @deno-types="npm:@types/chai@4.3.11"
import chai from 'npm:chai@4.3.10';

// @deno-types="npm:@types/sinon@17.0.2"
import sinon from 'npm:sinon@17.0.1';
import { RegisterState } from '@states/register-state.ts';
import { User } from '@src/user.ts';
import { InitState } from '@states/init-state.ts';
import { UI } from '@src/utils.ts';

const expect = chai.expect;

describe('RegisterState', () => {
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

	it('should return InitState and register a new user', async () => {
		const username = 'testuser';
		const password = 'testpassword';
		sandbox.stub(Input, 'prompt').resolves(username);
		sandbox.stub(Secret, 'prompt').resolves(password);
		const userCreateStub = sandbox.stub(User, 'create').resolves(
			{} as User,
		);

		const registerState = new RegisterState();
		const nextState = await registerState.run();

		expect(nextState).to.be.instanceOf(InitState);
		userCreateStub.calledOnceWithExactly(username, password);
	});
});

import 'npm:reflect-metadata';
import {
	afterEach,
	beforeEach,
	describe,
	it,
} from 'https://deno.land/std@0.208.0/testing/bdd.ts';
import { Select } from '@cliffy/prompt/select.ts';
import { InitState } from '@states/init-state.ts';
import { LoginState } from '@states/login-state.ts';

// @deno-types="npm:@types/chai@4.3.11"
import chai from 'npm:chai@4.3.10';
// @deno-types="npm:@types/chai-as-promised@7.1.8"
import chaiAsPromised from 'npm:chai-as-promised@7.1.1';

// @deno-types="npm:@types/sinon@17.0.2"
import sinon from 'npm:sinon@17.0.1';

import { RegisterState } from '@states/register-state.ts';
import { ExitState } from '@states/exit-state.ts';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('InitState', () => {
	let sandbox: sinon.SinonSandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should return LoginState when action is "login"', async () => {
		sandbox.stub(Select, 'prompt').returns(
			Promise.resolve('login'),
		);

		const initState = new InitState();
		const nextState = await initState.run();

		expect(nextState).to.be.instanceOf(LoginState);
	});

	it('should return RegisterState when action is "register"', async () => {
		sandbox.stub(Select, 'prompt').returns(
			Promise.resolve('register'),
		);

		const initState = new InitState();
		const nextState = await initState.run();

		expect(nextState).to.be.instanceOf(RegisterState);
	});

	it('should return InitState when action is "join"', async () => {
		sandbox.stub(Select, 'prompt').returns(
			Promise.resolve('join'),
		);

		const initState = new InitState();
		const nextState = await initState.run();

		expect(nextState).to.be.instanceOf(InitState);
	});

	it('should return ExitState when action is "exit"', async () => {
		sandbox.stub(Select, 'prompt').returns(
			Promise.resolve('exit'),
		);

		const initState = new InitState();
		const nextState = await initState.run();

		expect(nextState).to.be.instanceOf(ExitState);
	});
});

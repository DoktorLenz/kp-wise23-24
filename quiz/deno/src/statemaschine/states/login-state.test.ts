import 'npm:reflect-metadata';
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
import { User } from '@src/user.ts';
import { LoginState } from '@states/login-state.ts';
import { LoggedInState } from '@states/logged-in/logged-in-state.ts';
import { UI } from '@src/utils.ts';

const expect = chai.expect;

describe('LoginState', () => {
	let sandbox: sinon.SinonSandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(UI, 'prompt');
		sandbox.stub(UI, 'clear');
		sandbox.stub(UI, 'pause');

		sandbox.stub(Deno, 'readFile').resolves(
			new Uint8Array(),
		);
		sandbox.stub(Deno, 'writeFile').resolves();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should return LoggedInState when user is found', async () => {
		sandbox.stub(Input, 'prompt').returns(
			Promise.resolve('username'),
		);
		sandbox.stub(Secret, 'prompt').returns(
			Promise.resolve('password'),
		);

		const mockedUser = await User.create('username', 'password');

		sandbox.stub(User, 'checkLogin').withArgs(
			'username',
			'password',
		).returns(Promise.resolve(mockedUser));

		const loginState = new LoginState();
		const nextState = await loginState.run();

		expect(nextState).to.be.instanceOf(LoggedInState);
	});

	it('should return LoginState when user is not found', async () => {
		sandbox.stub(Input, 'prompt').returns(
			Promise.resolve('username'),
		);
		sandbox.stub(Secret, 'prompt').returns(
			Promise.resolve('password'),
		);

		sandbox.stub(User, 'checkLogin').throws(new Error());

		const loginState = new LoginState();
		const nextState = await loginState.run();

		expect(nextState).to.be.instanceOf(LoginState);
	});
});

import 'npm:reflect-metadata';
import {
	afterEach,
	beforeEach,
	describe,
	it,
} from 'https://deno.land/std@0.208.0/testing/bdd.ts';

// @deno-types="npm:@types/chai@4.3.11"
import chai from 'npm:chai@4.3.10';
// @deno-types="npm:@types/chai-as-promised@7.1.8"
import chaiAsPromised from 'npm:chai-as-promised@7.1.1';

// @deno-types="npm:@types/sinon@17.0.2"
import sinon from 'npm:sinon@17.0.1';

import { ExitState } from '@states/exit-state.ts';

chai.use(chaiAsPromised);

describe('ExitState', () => {
	let sandbox: sinon.SinonSandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Should exit programm with success', async () => {
		const mock = sandbox.mock(Deno);
		mock.expects('exit').withArgs(0).once();

		const exitState = new ExitState();
		await exitState.run();
		mock.verify();
	});
});

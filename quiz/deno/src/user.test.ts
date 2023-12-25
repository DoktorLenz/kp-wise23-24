import { User } from './user.ts';
import {
	afterEach,
	beforeEach,
	describe,
	it,
} from 'https://deno.land/std@0.208.0/testing/bdd.ts';
import 'npm:reflect-metadata';

// @deno-types="npm:@types/chai@4.3.11"
import chai from 'npm:chai@4.3.10';

// @deno-types="npm:@types/sinon@17.0.2"
import sinon from 'npm:sinon@17.0.1';
import { TypeHandler } from '@decoverto';
import { FS } from '@src/utils.ts';

const expect = chai.expect;

describe('User', () => {
	let sandbox: sinon.SinonSandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();

		sandbox.stub(FS, 'readFile').resolves(new Uint8Array());
		sandbox.stub(FS, 'writeFile').resolves();

		sandbox.stub(TypeHandler.prototype, 'instanceArrayToRaw')
			.returns('');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('create', () => {
		it('should create a new user', async () => {
			const username = 'testuser';
			const password = 'testpassword';

			const user = await User.create(username, password);

			expect(user).to.be.instanceOf(User);
			expect(user.username).to.equal(username);
			expect(user.isPasswordValid(password)).to.be.true;
		});
	});

	describe('isPasswordValid', () => {
		it('should return true if the password is valid', async () => {
			const username = 'testuser';
			const password = 'testpassword';

			const user = await User.create(username, password);

			expect(user.isPasswordValid(password)).to.be.true;
		});
		it('should return false if the password is invalid', async () => {
			const username = 'testuser';
			const password = 'testpassword';

			const user = await User.create(username, password);

			expect(user.isPasswordValid('wrongpassword')).to.be
				.false;
		});
	});

	describe('isAnyUserRegistered', () => {
		it('should return true if there are registered users', async () => {
			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([User.create('testuser', 'testpassword')]);

			const result = await User.isAnyUserRegistered();

			expect(result).to.be.true;
		});

		it('should return false if there are no registered users', async () => {
			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([]);

			const result = await User.isAnyUserRegistered();

			expect(result).to.be.false;
		});
	});

	describe('checkLogin', () => {
		it('should return the user if login credentials are valid', async () => {
			const username = 'testuser';
			const password = 'testpassword';

			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([User.create(username, password)]);

			const user = await User.checkLogin(username, password);

			expect(user).to.be.instanceOf(User);
			expect(user.username).to.equal(username);
		});

		it('should throw an error if username is not found', async () => {
			const username = 'nonexistentuser';
			const password = 'testpassword';

			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([User.create('testuser', password)]);

			try {
				await User.checkLogin(username, password);
				// If no error is thrown, the test should fail
				expect.fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).to.equal('NO USER');
			}
		});

		it('should throw an error if password is incorrect', async () => {
			const username = 'testuser';
			const password = 'incorrectpassword';

			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([User.create(username, 'testpassword')]);

			try {
				await User.checkLogin(username, password);
				// If no error is thrown, the test should fail
				expect.fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).to.equal(
					'Wrong credentials',
				);
			}
		});
	});

	describe('isUsernameTaken', () => {
		it('should return true if the username is taken', async () => {
			const username = 'existinguser';

			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([User.create(username, 'testpassword')]);

			const result = await User.isUsernameTaken(username);

			expect(result).to.be.true;
		});

		it('should return false if the username is not taken', async () => {
			const username = 'newuser';

			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([
				User.create('existinguser', 'testpassword'),
			]);

			const result = await User.isUsernameTaken(username);

			expect(result).to.be.false;
		});
	});

	describe('getUsernameById', () => {
		it('should return the username for a given id', async () => {
			const id = '550e8400-e29b-11d4-a716-446655440000';
			const username = 'testuser';

			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([
				{
					id,
					username,
					password: 'testpassword',
				},
			]);

			const receivedUsername = await User.getUsernameById(id);

			expect(receivedUsername).to.equal(username);
		});

		it('should return an empty string if the id is not found', async () => {
			const id = 'nonexistentid';

			sandbox.stub(
				TypeHandler.prototype,
				'rawToInstanceArray',
			).returns([]);

			const username = await User.getUsernameById(id);

			expect(username).to.equal('');
		});
	});
});

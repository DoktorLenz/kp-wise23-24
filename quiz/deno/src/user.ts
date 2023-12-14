import * as bcrypt from '@bcrypt';
import { dataDir } from '@src/utils.ts';
import { Decoverto, model, property } from '@decoverto';

@model()
export class User {
	@property()
	id: string;

	@property()
	username: string;

	@property()
	password: string;

	private constructor(
		id: string,
		username: string,
		password: string,
	) {
		this.id = id;
		this.username = username;
		this.password = password;
	}

	public isPasswordValid(password: string): boolean {
		if (this.password) {
			return bcrypt.compareSync(password, this.password);
		}
		return false;
	}

	static async create(username: string, password: string): Promise<User> {
		const users = await this.getAllUsers();
		const user = new User(
			crypto.randomUUID(),
			username,
			bcrypt.hashSync(password),
		);

		users.push(user);
		await this.saveAllUsers(users);
		return user;
	}

	public static async isAnyUserRegistered(): Promise<boolean> {
		const users = await this.getAllUsers();
		return users.length > 0;
	}

	private static async saveAllUsers(users: User[]): Promise<void> {
		const encoder = new TextEncoder();
		const decoverto = new Decoverto();

		const raw = decoverto.type(User).instanceArrayToRaw(users);
		await Deno.mkdir(dataDir, { recursive: true });

		await Deno.writeFile(
			`${dataDir}/users.json`,
			encoder.encode(raw),
			{ create: true },
		);
	}

	private static async getAllUsers(): Promise<User[]> {
		const decoder = new TextDecoder();
		const decoverto = new Decoverto();

		try {
			const raw = await Deno.readFile(
				`${dataDir}/users.json`,
			);

			return decoverto.type(User).rawToInstanceArray(
				decoder.decode(raw),
			);
		} catch (_error) {
			return [];
		}
	}

	static async checkLogin(
		username: string,
		password: string,
	): Promise<User> {
		const users = await this.getAllUsers();

		const user = users.find((user) => user.username === username);
		if (!user) {
			throw new Error('NO USER');
		}
		const isPasswordValid = user.isPasswordValid(password);
		if (!isPasswordValid) {
			throw new Error('Wrong credentials');
		}
		return user;
	}

	static async isUsernameTaken(username: string): Promise<boolean> {
		const users = await this.getAllUsers();
		const user = users.find((user) => user.username === username);
		return !!user;
	}
}

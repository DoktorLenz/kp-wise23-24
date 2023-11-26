import {
	Input,
	Secret,
} from 'https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts';

import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
import { isLinux } from 'https://deno.land/std@0.196.0/_util/os.ts';

interface IUser {
	username: string;
	password: string;
}

export class User implements IUser {
	private _username: string = '';

	public get username(): string {
		return this._username;
	}
	private set username(username: string) {
		this._username = username;
	}

	private _password = '';

	public set password(unencryptedPassword: string) {
		this._password = bcrypt.hashSync(unencryptedPassword);
	}

	public get userdata(): IUser {
		return {
			username: this.username,
			password: this._password,
		};
	}

	constructor(userdata: IUser) {
		this.username = userdata.username;
		this.password = userdata.password;
	}

	private isPasswordValid(password: string): Promise<boolean> {
		return bcrypt.compare(password, this._password);
	}

	static async register(): Promise<void> {
		const users = await getUsers();

		const username = await Input.prompt({
			message: 'Choose a username: ',
			validate: (value) => {
				if (value.length < 3) {
					return 'Username must be at least 3 characters long';
				}

				const isUsernameTaken = users.find((user) =>
					user._username === value
				);
				if (isUsernameTaken) {
					return 'Username already taken';
				}

				return true;
			},
		});

		const password = await Secret.prompt({
			message: 'Set a password: ',
			validate: (value) =>
				value.length < 8
					? 'Password must be at least 8 characters long'
					: true,
		});

		await Secret.prompt({
			message: 'Repeate password: ',
			validate: (value) =>
				value === password
					? true
					: 'Passwords do not match',
		});

		saveUser(new User({ username, password }));
	}

	static async login(): Promise<User> {
		const username = await Input.prompt('Username: ');
		console.log(username);
		const password = await Secret.prompt('Password: ');

		const users = await getUsers();

		const user = users.find((user) => user._username === username);
		const isPasswordValid = user &&
			await user.isPasswordValid(password);
		if (!isPasswordValid) {
			throw new Error('Wrong credentials');
		}
		return user;
	}
}

export async function getUsers(): Promise<User[]> {
	const decoder = new TextDecoder();
	try {
		const data = await Deno.readFile('./data/users.json');
		const userdatas = JSON.parse(decoder.decode(data));
		const users = userdatas.map((user: IUser) => {
			return new User(user);
		});
		return users;
	} catch (_error) {
		return [];
	}
}

export async function saveUser(user: User): Promise<void> {
	const users = await getUsers();
	users.push(user);
	const userdatas: IUser[] = users.map((user) => user.userdata);
	const encoder = new TextEncoder();
	await Deno.writeFile(
		'./data/users.json',
		encoder.encode(
			JSON.stringify(userdatas),
		),
	);
}

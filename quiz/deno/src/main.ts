import { Select } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/select.ts';
import { clearConsole } from './utils.ts';
import { User } from './user.ts';

clearConsole();

enum Action {
	Login = 'login',
	Register = 'register',
	Join = 'join',
	Exit = 'exit',
}

const action: string = await Select.prompt({
	message: 'Welcome to THE QUIZ APP',
	options: [
		{ name: 'Login', value: Action.Login },
		{ name: 'Register', value: Action.Register },
		{ name: 'Join Quiz', value: Action.Join },
		{ name: 'Exit', value: Action.Exit },
	],
});

switch (action) {
	case Action.Login:
		login();
		break;
	case Action.Register:
		await register();
		break;
	case Action.Join:
		join();
		break;
	case Action.Exit:
		exit();
		break;
}

async function register() {
	clearConsole();
	await User.register();
}

async function login() {
	try {
		const user = await User.login();
		console.log('Welcome ' + user.username);
	} catch (error) {
		console.log(error);
	}
}

async function join() {}

function exit() {
	clearConsole();
	console.log('Hope to see you soon, bye!');
}

import dir from '@dir';
import { sleep } from '@sleep';

export const dataDir = `${dir('data')}/quiz`;

export class UI {
	static prompt(
		message?: string,
		data?: string,
	): void {
		if (message) {
			if (data) {
				console.log(message, data);
			} else {
				console.log(message);
			}
		} else {
			console.log();
		}
	}

	static pause(seconds: number): Promise<unknown> {
		return sleep(seconds);
	}

	static clear() {
		console.log('\x1Bc');
	}
}

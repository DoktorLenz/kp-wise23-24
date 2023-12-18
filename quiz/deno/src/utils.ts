import dir from '@dir';
import { sleep } from '@sleep';

export const dataDir = `${dir('data')}/quiz`;

export class UI {
	static prompt(
		message?: string,
		data?: string,
		seconds?: number,
	): Promise<unknown> {
		console.log(message, data);
		return this.pause(seconds ?? 0);
	}

	static pause(seconds: number): Promise<unknown> {
		return sleep(seconds);
	}

	static clear() {
		console.log('\x1Bc');
	}
}

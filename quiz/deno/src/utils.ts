import dir from '@dir';
import { sleep } from '@sleep';

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

export class FS {
	private static dataDir = `${dir('data')}/quiz`;

	private static mkdir(
		options?: Deno.MkdirOptions,
	): Promise<void> {
		return Deno.mkdir(`${this.dataDir}`, options);
	}

	static writeFile(
		fileName: string,
		data: Uint8Array | ReadableStream<Uint8Array>,
		options?: Deno.WriteFileOptions | undefined,
	): Promise<void> {
		return this.mkdir({ recursive: true }).then(() =>
			Deno.writeFile(
				`${this.dataDir}/${fileName}`,
				data,
				options,
			)
		);
	}

	static readFile(
		fileName: string,
		options?: Deno.ReadFileOptions | undefined,
	): Promise<Uint8Array> {
		return Deno.readFile(
			`${this.dataDir}/${fileName}`,
			options,
		);
	}
}

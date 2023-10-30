import { walk } from 'https://deno.land/std@0.170.0/fs/walk.ts';
import { Command, getGeneratorFunctions } from './core/command.ts';
import { Directory } from './core/directory.ts';
import { Console } from './console.ts';
import { getLogger, Logger } from 'https://deno.land/std@0.204.0/log/mod.ts';

export class Environment {
	private rootDirectory;
	private currentWorkingDirectory;
	private commands: { [commandName: string]: Command } = {};

	private get logger(): Logger {
		return getLogger('std');
	}

	constructor(public readonly console: Console) {
		this.rootDirectory = new Directory('', null);
		this.currentWorkingDirectory = this.rootDirectory;
	}

	async loadTsCommands(): Promise<void> {
		this.logger.debug('Loading TS Commands ...');
		this.commands = {};
		for await (const entry of walk(Deno.cwd() + '/src/commands')) {
			if (entry.isFile && entry.name.endsWith('.ts')) {
				const module = await import(
					`file:///${entry.path}`
				);
				// Assumes every function in the module is a command generator
				getGeneratorFunctions(module).forEach(
					(generator) => {
						const command: Command =
							generator(this);
						this.commands[
							command.accessor
						] = command;
						this.logger.debug(
							`Loaded command '${command.accessor}'`,
						);
					},
				);
			}
		}
		this.logger.debug('TS Commands loaded!');
	}

	async run(): Promise<void> {
		let input: string | null = null;

		while (input !== 'exit') {
			input = this.console.read('user@local:');

			if (input) {
				const command: string = input.split(/\s/)[0];
				if (this.commands[command]) {
					await this.commands[command].execute(
						input.substring(
							command.length + 1,
							input.length,
						),
					);
				} else {
					this.console.println(
						`Command '${input}' not found`,
					);
				}
			}
		}
	}

	public set cwd(directory: Directory) {
		this.currentWorkingDirectory = directory;
	}

	public get cwd(): Directory {
		return this.currentWorkingDirectory;
	}
}

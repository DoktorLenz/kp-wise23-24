import { Command, CommandGenerator } from '../../core/command.ts';
import { Environment } from '../../environment.ts';

class cd extends Command {
	public execute(input: string): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.changeDirectory(input);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	private changeDirectory(input: string) {
		const paths = input.split('/');
		const startDirectory = this.env.cwd;
		for (const path of paths) {
			if (path === '..') {
				this.env.cwd = this.env.cwd.parent ??
					this.env.cwd;
			} else if (path !== '.') {
				const directory = this.env.cwd.getDirectory(
					path,
				);
				if (directory) {
					this.env.cwd = directory;
				} else {
					this.env.cwd = startDirectory;
					this.env.console.println(
						'Path not found',
					);
					break;
				}
			}
		}
	}
}

export const generator: CommandGenerator = (env: Environment) => {
	return new cd('cd', env);
};
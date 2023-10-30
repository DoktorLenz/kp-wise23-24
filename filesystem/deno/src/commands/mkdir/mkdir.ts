import { Command, CommandGenerator } from '../../core/command.ts';
import { Directory } from '../../core/directory.ts';
import { Environment } from '../../environment.ts';

class mkdir extends Command {
	public execute(input: string): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.env.cwd.appendChild(
					new Directory(input, this.env.cwd),
				);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}
}

export const generator: CommandGenerator = (env: Environment) => {
	return new mkdir('mkdir', env);
};

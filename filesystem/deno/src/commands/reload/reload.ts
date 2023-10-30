import { Command, CommandGenerator } from '../../core/command.ts';
import { Environment } from '../../environment.ts';

class reload extends Command {
	public async execute(): Promise<string | void> {
		await this.env.loadTsCommands();
	}
}

export const generator: CommandGenerator = (env: Environment) => {
	return new reload('reload', env);
};

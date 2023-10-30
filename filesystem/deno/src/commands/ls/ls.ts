import { Command, CommandGenerator } from '../../core/command.ts';
import { Environment } from '../../environment.ts';

class ls extends Command {
	public execute(): Promise<void> {
		return new Promise((resolve) => {
			this.env.cwd.getChildren().forEach((obj) =>
				this.env.console.println(obj.name)
			);
			resolve();
		});
	}
}

export const generator: CommandGenerator = (env: Environment) => {
	return new ls('ls', env);
};

import { Environment } from '../environment.ts';

export abstract class Command {
	constructor(
		public readonly accessor: string,
		protected readonly env: Environment,
	) {}
	public abstract execute(input: string): Promise<string | void>;
}

export type CommandGenerator = (environment: Environment) => Command;

export function getGeneratorFunctions(
	obj: Record<string, unknown>,
): CommandGenerator[] {
	const generatorFunctions: CommandGenerator[] = [];
	for (const key in obj) {
		if (typeof obj[key] === 'function') {
			generatorFunctions.push(obj[key] as CommandGenerator);
		}
	}
	return generatorFunctions;
}

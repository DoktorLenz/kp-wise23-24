import { Directory } from "./directory.ts";

export abstract class Command {
    constructor(public readonly accessor: string, protected readonly cwd: Directory) {}
    public abstract execute(...args: any): string | void;
}

export type CommandGenerator = (cwd: Directory) => void;

export function getGeneratorFunctions(obj: Record<string, unknown>): CommandGenerator[] {
    const generatorFunctions: CommandGenerator[] = [];
    for (const key in obj) {
        if (typeof obj[key] === 'function') {
            generatorFunctions.push(obj[key] as CommandGenerator);
        }
    }
    return generatorFunctions;
}
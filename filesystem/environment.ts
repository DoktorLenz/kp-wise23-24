import { walk } from "https://deno.land/std@0.170.0/fs/walk.ts";
import { Command,getGeneratorFunctions } from "./core/command.ts";
import { Directory } from "./core/directory.ts";
import { Console } from "./console.ts";

export class Environment {
    private rootDirectory;
    private currentWorkingDirectory;
    private commands: {[commandName: string]: Command} = {}


    constructor(public readonly console: Console) {
        this.rootDirectory = new Directory("", null);
        this.currentWorkingDirectory = this.rootDirectory;
    }

    async loadTsCommands(): Promise<void> {
        this.commands = {};
        for await (const entry of walk(Deno.cwd() + "/commands")) {
            if (entry.isFile && entry.name.endsWith(".ts")) {
                const module = await import(`file:///${entry.path}`)
                // Assumes every function in the module is a command generator
                getGeneratorFunctions(module).forEach(generator => {
                    const command: Command = generator(this);
                    this.commands[command.accessor] = command;
                });
            }
        }
    }

    run(): void {
        let input: string | null = null;

        while (input !== "exit") {
            input = this.console.read("user@local:");

            if (input) {
                const command: string = input.split(/\s/)[0];
                if (this.commands[command]) {
                    this.commands[command].execute(input.substring(command.length + 1, input.length));
                } else {
                    this.console.println(`Command '${input}' not found`);
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
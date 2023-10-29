
import { Command, getGeneratorFunctions } from "./core/command.ts";
import { Directory } from "./core/directory.ts";
import { walk } from "https://deno.land/std@0.170.0/fs/walk.ts";

const rootDirectory = new Directory();
const currentWorkingDirectory = rootDirectory;
const commands: {[commandName: string]: Command} = {}

async function loadTsCommands(): Promise<void> {
  for await (const entry of walk("./commands")) {
    if (entry.isFile && entry.name.endsWith(".ts")) {
      const module = await import(`./${entry.path}`)
      // Assumes every function in the module is a command generator
      getGeneratorFunctions(module).forEach(generator => {
        const command: Command = generator(currentWorkingDirectory);
        commands[command.accessor] = command;
      });
    }
  }
}

await loadTsCommands();

let input: string | null = null;

while (input !== "exit") {
  input = prompt("user@local:");

  if (input && commands[input]) {
    commands[input].execute(currentWorkingDirectory);
  } else {
    console.warn(`Command '${input}' not found`);
  }
}




// commands["ls"].execute(rootDirectory);
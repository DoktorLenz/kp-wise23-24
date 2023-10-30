import { Command, CommandGenerator } from "../../core/command.ts";
import { Directory } from "../../core/directory.ts";
import { Environment } from "../../environment.ts";

class mkdir extends Command {
  public execute(input: string): void {
    this.env.cwd.addFsObject(new Directory(input, this.env.cwd));
  }
  
}

export const generator: CommandGenerator = (env: Environment) => {
  return new mkdir("mkdir", env);
}
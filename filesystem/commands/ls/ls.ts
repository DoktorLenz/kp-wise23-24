import { Command, CommandGenerator } from "../../core/command.ts";
import { Environment } from "../../core/environment.ts";


class ls extends Command {
    public execute(): void {
        this.env.cwd.getFsObjects().forEach((obj) => this.env.console.println(obj.name));
    }

}

export const generator: CommandGenerator = (env: Environment) => {
    return new ls("ls", env);
}
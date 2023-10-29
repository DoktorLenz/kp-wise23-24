import { Directory } from "../../core/directory.ts";
import { Command,CommandGenerator } from "../../core/command.ts";


class ls extends Command {
    public execute(): string | void {
        console.log("Test");
    }

}

export const x: CommandGenerator = (cwd: Directory) => {
    return new ls("ls", cwd);
}
import { Command } from "../../core/command.ts";

class mkdir extends Command {
  public execute(): string|void {
    console.log("MKDIR")
  }
}
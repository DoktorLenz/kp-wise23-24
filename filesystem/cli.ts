import { Console } from "./console.ts";

export class Cli implements Console {
  read(message: string): string | null {
    return prompt(message);
  }
  println(message: string): void {
    console.log(message);
  }
}

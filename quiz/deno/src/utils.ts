import dir from "https://deno.land/x/dir@1.5.2/mod.ts";

export const dataDir = `${dir("data")}/quiz`;

export function clearConsole() {
  console.log("\x1Bc");
}

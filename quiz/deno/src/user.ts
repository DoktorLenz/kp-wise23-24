import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { dataDir } from "./utils.ts";
import "npm:reflect-metadata";
import { jsonMember, jsonObject, TypedJSON } from "npm:typedjson@1.8.0";

@jsonObject
export class User {
  @jsonMember
  id?: string;

  @jsonMember
  username?: string;

  @jsonMember
  password?: string;

  private constructor(
    id?: string,
    username?: string,
    password?: string,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  public isPasswordValid(password: string): boolean {
    if (this.password) {
      return bcrypt.compareSync(password, this.password);
    }
    return false;
  }

  static async create(username: string, password: string): Promise<void> {
    const users = await this.getAllUsers();
    const user = new User(
      crypto.randomUUID(),
      username,
      bcrypt.hashSync(password),
    );

    users.push(user);
    this.saveAllUsers(users);
  }

  public static async isAnyUserRegistered(): Promise<boolean> {
    const users = await this.getAllUsers();
    return users.length > 0;
  }

  private static async saveAllUsers(users: User[]): Promise<void> {
    const encoder = new TextEncoder();
    const serializer = new TypedJSON(User);

    await Deno.mkdir(dataDir, { recursive: true });

    await Deno.writeFile(
      `${dataDir}/users.json`,
      encoder.encode(serializer.stringifyAsArray(users)),
      { create: true },
    );
  }

  private static async getAllUsers(): Promise<User[]> {
    const decoder = new TextDecoder();
    const serializer = new TypedJSON(User);

    try {
      const content = await Deno.readFile(`${dataDir}/users.json`);

      return serializer.parseAsArray(decoder.decode(content));
    } catch (_error) {
      return [];
    }
  }

  static async checkLogin(username: string, password: string): Promise<User> {
    const users = await this.getAllUsers();

    const user = users.find((user) => user.username === username);
    if (!user) {
      throw new Error("NO USER");
    }
    const isPasswordValid = user.isPasswordValid(password);
    if (!isPasswordValid) {
      throw new Error("Wrong credentials");
    }
    return user;
  }

  static async isUsernameTaken(username: string): Promise<boolean> {
    const users = await this.getAllUsers();
    const user = users.find((user) => user.username === username);
    return !!user;
  }
}

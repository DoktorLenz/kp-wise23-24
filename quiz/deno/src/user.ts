import dir from "https://deno.land/x/dir@1.5.2/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

interface IUser {
  username: string;
  password: string;
}

const dataDir = `${dir("data")}/quiz`;

export class User implements IUser {
  private _username: string = "";

  public get username(): string {
    return this._username;
  }
  private set username(username: string) {
    this._username = username;
  }

  protected _password = "";

  public set password(unencryptedPassword: string) {
    this._password = bcrypt.hashSync(unencryptedPassword);
  }

  public get userdata(): IUser {
    return {
      username: this.username,
      password: this._password,
    };
  }

  private constructor() {}

  public isPasswordValid(password: string): boolean {
    return bcrypt.compareSync(password, this._password);
  }

  static deserialize(data: IUser): User {
    const user = new User();
    user.username = data.username;
    user._password = data.password;
    return user;
  }

  static async create(username: string, password: string): Promise<void> {
    const users = await this.allUsers();
    const user = new User();
    user.username = username;
    user.password = password;
    users.push(user);
    const userdatas: IUser[] = users.map((user) => user.userdata);
    const encoder = new TextEncoder();
    await Deno.mkdir(dataDir, { recursive: true });
    await Deno.writeFile(
      `${dataDir}/users.json`,
      encoder.encode(
        JSON.stringify(userdatas),
      ),
      { create: true },
    );
  }

  // Only to be used for user data loaded from disk
  static fromDisk(username: string, encryptedPassword: string): User {
    const user = new User();
    user.username = username;
    user._password = encryptedPassword;
    return user;
  }

  public static async isAnyUserRegistered(): Promise<boolean> {
    const users = await this.allUsers();
    return users.length > 0;
  }

  private static async allUsers(): Promise<User[]> {
    const decoder = new TextDecoder();
    try {
      const data = await Deno.readFile(`${dataDir}/users.json`);
      const userdatas = JSON.parse(decoder.decode(data));

      const users = userdatas.map((userData: IUser) => {
        const user = new User();
        user.username = userData.username;
        user._password = userData.password;
        return user;
      });
      return users;
    } catch (_error) {
      return [];
    }
  }

  static async checkLogin(username: string, password: string): Promise<User> {
    const users = await this.allUsers();

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
    const users = await this.allUsers();
    const user = users.find((user) => user.username === username);
    return !!user;
  }
}

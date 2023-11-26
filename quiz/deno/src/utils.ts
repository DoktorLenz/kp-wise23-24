export function clearConsole() {
	console.log('\x1Bc');
}

export interface ISerializable<T extends I, I> {
	new (): T;
	serialize(): string;
	deserialize(data: I): T;
}

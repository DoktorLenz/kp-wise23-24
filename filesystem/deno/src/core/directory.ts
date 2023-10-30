import { FsObjectType } from './fs-object-type.enum.ts';
import { FsObject } from './fs-object.ts';

export class Directory extends FsObject {
	private readonly children: FsObject[] = [];

	constructor(
		public readonly name: string,
		public readonly parent: Directory | null,
	) {
		super(name, parent, FsObjectType.DIRECTORY);
	}

	public appendChild(child: FsObject): void {
		this.children.push(child);
	}

	public getChildren(): FsObject[] {
		return this.children;
	}

	public getChildDirectory(name: string): Directory | null {
		return this.children
			.find((obj) =>
				obj.fsObjectType === FsObjectType.DIRECTORY &&
				obj.name === name
			) as Directory;
	}
}

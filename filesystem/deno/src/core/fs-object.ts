import { Directory } from './directory.ts';
import { FsObjectType } from './fs-object-type.enum.ts';

export abstract class FsObject {
	constructor(
		public readonly name: string,
		public readonly parent: FsObject | null,
		public readonly fsObjectType: FsObjectType,
	) {}
}

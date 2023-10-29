import { FsObjectType } from "./fs-object-type.enum.ts";
import { FsObject } from "./fs-object.ts";

export class Directory extends FsObject{
    private readonly fsObjects: FsObject[] = []

    constructor(public readonly name: string, public readonly parent: Directory | null) {
        super(name, parent, FsObjectType.DIRECTORY);
    }

    public addFsObject(fsObject: FsObject): void {
        this.fsObjects.push(fsObject);
    }

    public getFsObjects(): FsObject[] {
        return this.fsObjects;
    }

    public getDirectory(name: string): Directory | null {
        return this.fsObjects
            .find((obj) => obj.fsObjectType === FsObjectType.DIRECTORY && obj.name === name) as Directory;
    }
}
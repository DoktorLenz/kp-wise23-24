import { FsObject } from "./fs-object.ts";

export class Directory{
    private readonly fsObjects: {[fsObjectName: string]: FsObject} = {}


    public addDirectory(directory: Directory): void {
        // this.fsObjects[directory.name] = directory;
    }
}
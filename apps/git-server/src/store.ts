// export const getRootDirectory = process.env.ROOT_DIRECTORY || "../../../mini-git-gui";
// export const rootDirectory = "../../../mini-text-editor"

let rootDirectory = "";

export function getRootDirectory() {
    return rootDirectory;
}

export function setRootDirectory(directory: string) {
    rootDirectory = directory;
}
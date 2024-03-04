import { atom } from 'jotai'
// import { atomWithStorage } from 'jotai/utils'
import { AppRouterOutput } from './trpc';

type ServerState = "Pending" | "Success" | "Error"
export const serverConnectionStateAtom = atom<ServerState>("Pending");
export const serverUrlAtom = atom("");
// export const serverUrlAtom = atomWithStorage("git-server-url", ""); // Commented because when serving via git-server, would like to use "" by default instead of whatever cache

type Page = "AllCommits" | "LocalChanges"
export const pageAtom = atom<Page>("AllCommits");

type Stack = "None" | "Diff"
export const stackAtom = atom<Stack>("None");

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0]
type StagedFile = AppRouterOutput["getStatus"]["stagedFiles"][0]
type File = UnstagedFile | StagedFile
type FileType = "Unstaged" | "Staged"
export const selectedFilesAtom = atom<{ fileType: FileType, selectedFiles: File[] }>({ fileType: "Unstaged", selectedFiles: [] })
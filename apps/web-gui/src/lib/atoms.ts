import { atom } from 'jotai'
import { AppRouterOutput } from './trpc';

type ServerState = "Pending" | "Success" | "Error"
export const serverConfigAtom = atom<{ state: ServerState, url: string }>({ state: "Pending", url: "" });

type Page = "AllCommits" | "LocalChanges"
export const pageAtom = atom<Page>("AllCommits");

type Stack = "None" | "Diff"
export const stackAtom = atom<Stack>("None");

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0]
type StagedFile = AppRouterOutput["getStatus"]["stagedFiles"][0]
type File = UnstagedFile | StagedFile
type FileType = "Unstaged" | "Staged"
export const selectedFilesAtom = atom<{ fileType: FileType, selectedFiles: File[] }>({ fileType: "Unstaged", selectedFiles: [] })
import { atom } from 'jotai'
import { AppRouterOutput } from './trpc';

type Page = "AllCommits" | "LocalChanges"
export const pageAtom = atom<Page>("AllCommits");

type Stack = "None" | "Diff"
export const stackAtom = atom<Stack>("None");

type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0]
type StagedFile = AppRouterOutput["getStatus"]["stagedFiles"][0]
type File = UnstagedFile | StagedFile
export const selectedFilesAtom = atom<File[]>([])
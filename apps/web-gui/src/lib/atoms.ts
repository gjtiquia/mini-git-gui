import { atom } from 'jotai'

type Page = "AllCommits" | "LocalChanges"
export const pageAtom = atom<Page>("AllCommits");

type Stack = "None" | "Diff"
export const stackAtom = atom<Stack>("None");
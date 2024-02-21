import { atom } from 'jotai'

type Page = "AllCommits" | "LocalChanges"
export const pageAtom = atom<Page>("AllCommits");
import { AppRouterOutput } from "@/lib/trpc";

export type UnstagedFile = AppRouterOutput["getStatus"]["unstagedFiles"][0];
export type StagedFile = AppRouterOutput["getStatus"]["stagedFiles"][0];
export type File = UnstagedFile | StagedFile;

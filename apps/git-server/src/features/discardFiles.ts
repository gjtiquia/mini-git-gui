// Discard has different commands for tracked (existing) and untracked (new) files

// Untracked files: git clean -f <file-1> <file-2> ...
// (remember to pass in filepath OR ELSE ALL UNTRACKED FILES WILL BE DELETED)
// (-f must be passed or else will not clean. fyi: -i for interactive mode)

// Tracked files: git restore <file-1> <file-2> ...
// (recommended by git status command)
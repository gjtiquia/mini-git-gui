/*

Ref: https://git-scm.com/docs/git-diff

option --word-diff=porcelain
- basically splits the line into tokens
- uses ~ to represent newline
- prefix "+" => added
- prefix "-" => removed
- prefix " " => unchanged

# Unstaged files

## Unstaged tracked files
$ git diff --word-diff=porcelain <file-name>

## Unstaged untracked files
- git diff shows nothing because nothing to compare with
- solution: return all the lines of the untracked file

# Staged files

## Staged tracked files
$ git diff --staged --word-diff=porcelain <file-name>

## Staged untracked files
$ git diff --staged --word-diff=porcelain <file-name>
- Works!

*/
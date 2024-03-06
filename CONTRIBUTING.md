# Mini Git GUI - Contributing

This monorepo uses NPM workspaces and is managed with [Turborepo](https://turbo.build/repo).

## Commands

Install all dependencies.

```bash
npm install
```

Build all packages.

```bash
npm run build
```

Start a dev server for `git-server`

```bash
npm run dev:git-server
```

Start a dev server for `web-gui`

```bash
npm run dev:web-gui
```

## Publishing to NPM

Login to npm account.

```bash
npm login
```

### Adding changesets

Good practice to add one per package for cleaner changelogs.

```bash
npm run changeset
```

Follow the prompts in the CLI.

Press spacebar to select and enter to confirm.

Press enter without selecting anything to skip (eg. the major bumps).

Can continue editing the changelog summary later in the generated markdown file.

Commit after adding a changeset(s).

### Versioning

```bash
npm run changeset:version
```

This consumes all changesets, and updates to the most appropriate semver version based on those changesets. It also writes changelog entries for each consumed changeset.

Commit after running this command and reviewing all the changes.

Can review what each package will publish to NPM with the following command. Run this in the root directory of the package to review.

```bash
npm publish --dry-run
```

### Publishing

```bash
npm run changeset:publish
```

Immediately publishes the current commit to NPM.

Do not add commits between versioning and publishing as it assumes the versioning commit to be the publishing commit.

Git tags will be created. Remember to push the git tags.

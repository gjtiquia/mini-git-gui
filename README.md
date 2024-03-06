# Mini Git GUI

A minimalistic git client for mobile.

## Quick Start

### Prerequisites

Have a terminal installed.

- Android: [Termux](https://termux.dev/en/)
- iOS: _(Coming Soon)_

Have Node.js installed.

- Android: [Termux - Node.js](https://wiki.termux.com/index.php?title=Node.js&mobileaction=toggle_view_mobile)
- iOS: _(Coming Soon)_

### Usage

Run the following command in your project root.

```bash
npx mini-git-gui
```

Go to the link shown (eg. <http://localhost:3000>) on a browser to access the git GUI.

### Notes

If you do not want a global install of `mini-git-gui`, you can choose to install it locally in your project folder.

``` bash
# Run this command if you do not have a package.json
npm init -y

# Installs mini-git-gui as a dev dependency
npm i -D mini-git-gui

# Run mini-git-gui
npx mini-git-gui
```

## Features

- Commit Graph _(Experimental)_
- Stage/Unstage Files
- Commit Files
- Discard Files
- View File Changes

## Tech Stack

- Frontend
  - React
  - Vite
  - Tailwind
  - Shadcn/ui
  - Tanstack Query
  - Jotai
- Backend
  - Express
  - TRPC

## For Developers

Commands and Contributing Guide: [CONTRIBUTING.md](./CONTRIBUTING.md)

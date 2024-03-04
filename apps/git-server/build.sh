#!/usr/bin/env bash

echo "Building @mini-git-gui/git-server..."

echo "Cleaning public directory..."
rm -rf public

echo "Copying build artifacts from @mini-git-gui/web-gui..."
mkdir public
cp -R ../web-gui/dist/. public/

echo "Compiling TypeScript into JavaScript..."
npm run build:compile

echo "Finished building @mini-git-gui/git-server!"

# Note:
# May encounter the following error when running from "npm run build":
#    sh: __git_ps1: command not found
# Restart the terminal to fix
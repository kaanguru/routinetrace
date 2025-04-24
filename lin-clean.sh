#!/bin/bash

echo "Removing node_modules folder..."
rm -rf node_modules

echo "Removing .expo..."
rm -rf .expo

echo "Removing android build folder..."
rm -rf android/build

echo "Deleting pnpm-lock..."
rm -f pnpm-lock.lock

echo "Cleaning pnpm cache..."
pnpm store prune

echo "Done. Run 'pnpm i' to reinstall dependencies."
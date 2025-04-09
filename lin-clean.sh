#!/bin/bash

echo "Removing .yarn folder..."
rm -rf .yarn/cache

echo "Removing node_modules folder..."
rm -rf node_modules

echo "Removing .expo..."
rm -rf .expo

echo "Removing android build folder..."
rm -rf android/build

echo "Deleting yarn.lock..."
rm -f yarn.lock

echo "Cleaning yarn cache..."
yarn cache clean --all

echo "Done. Run 'yarn' to reinstall dependencies."
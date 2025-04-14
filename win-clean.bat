@echo off

echo Removing .yarn and .yarn\cache folder...
if exist .yarn\cache rmdir /s /q .yarn\cache
if exist .yarn rmdir /s /q .yarn

echo Removing node_modules folder...
if exist node_modules rmdir /s /q node_modules

echo Removing .expo folder...
if exist .expo rmdir /s /q .expo

echo Removing android\build...
if exist android\build rmdir /s /q android\build

echo Deleting yarn.lock...
if exist yarn.lock del yarn.lock

echo Deleting pnpm-lock.yaml...
if exist pnpm-lock.yaml del pnpm-lock.yaml

echo clean cache...
pnpm store prune
pnpm cache clean --all

echo Done. Run "pnpm install" to reinstall dependencies.
pause
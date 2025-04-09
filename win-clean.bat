@echo off

echo Removing .yarn folder...
if exist .yarn\cache rmdir /s /q .yarn\cache

echo Removing node_modules folder...
if exist node_modules rmdir /s /q node_modules

echo Removing .expo...
if exist .expo rmdir /s /q .expo

echo Removing android...
if exist android\build rmdir /s /q android\build

echo Deleting yarn.lock...
if exist yarn.lock del yarn.lock

echo clean cache...
yarn cache clean --all

echo Done. Run "yarn" to reinstall dependencies.
pause
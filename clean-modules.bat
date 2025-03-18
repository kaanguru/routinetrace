@echo off

echo Removing node_modules...
rmdir /s /q node_modules

echo Removing .expo...
rmdir /s /q .expo

echo Removing android...
rmdir /s /q android

echo Deleting package-lock.json...
del package-lock.json

echo clean npm...
npm cache clean --force

echo Done , you can run npm install now.
pause
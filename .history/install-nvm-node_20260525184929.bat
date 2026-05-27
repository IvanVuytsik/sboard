@echo off
set NVM_HOME=C:\Users\Vuici\AppData\Local\nvm
set NVM_SYMLINK=C:\nvm4w\nodejs
set PATH=C:\Users\Vuici\AppData\Local\nvm;C:\nvm4w\nodejs;%PATH%
C:\Users\Vuici\AppData\Local\nvm\nvm.exe install 20.19.0
C:\Users\Vuici\AppData\Local\nvm\nvm.exe use 20.19.0
node -v
pause

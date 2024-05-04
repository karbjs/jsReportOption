@echo off
cd /D "%~dp0"
start %~dp0

:KInput
set /p XStart=Enter 1 for start:
if NOT %XStart% == 1 GOTO KInput

npm start

@echo on
pause
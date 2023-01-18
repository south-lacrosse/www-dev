@echo off
rem This script uses relative paths, so MUST be in
rem  C:\Users\{user}\{sites path}\www-dev\bin-local
if "%1"=="" (
	echo You must specify the site slug
	pause
	exit 1
)
if not exist "%~dp0..\..\..\AppData\Roaming\Local\ssh-entry\%1.bat" (
	echo Local Site shell "%cd%\AppData\Roaming\Local\ssh-entry\%1.bat" does not exist
	pause
	exit 1
)
call "%~dp0..\..\..\AppData\Roaming\Local\ssh-entry\%1.bat"
code "%~dp0..\south-lacrosse.code-workspace" | exit

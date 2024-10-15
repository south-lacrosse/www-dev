@echo off
rem The south-lacrosse.code-workspace file assumes the sister www repository
rem will be in ..\south-lacrosse\app\public relative to this repos root (that's
rem the location using the Local development tool).
if "%1"=="" (
	echo You must specify the site slug
	pause
	exit 1
)
if not exist "%APPDATA%\Local\ssh-entry\%1.bat" (
	echo Local Site shell "%APPDATA%\Local\ssh-entry\%1.bat" does not exist
	pause
	exit 1
)
call "%APPDATA%\Local\ssh-entry\%1.bat"
code "%~dp0..\south-lacrosse.code-workspace" | exit

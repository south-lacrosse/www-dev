@echo off
rem Update composer to latest version in Local

rem Must run as Administrator
rem Note: this change will get wiped out on the next Local update.

setlocal
rem Some antiviruses cause problems with Curl
echo Does your antivirus block Curl? If so make sure it's turned off before you continue.
pause
where /q php
if ERRORLEVEL 1 (
    echo PHP must be on the path
) else (
	cd "C:\Program Files (x86)\Local\resources\extraResources\bin\composer\"
	dir
	call "C:\Program Files (x86)\Local\resources\extraResources\bin\composer\win32\composer" self-update
	dir
)
pause

@echo off
rem Update WP-CLI in Local. Assumes wget is on the path.

rem Must run as Administrator
rem Note: this change will get wiped out on the next Local update.

setlocal
choice /C rn /M "Select [R]elease or [N]ightly"
if %ERRORLEVEL% equ 2 set URL=https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli-nightly.phar
if %ERRORLEVEL% equ 1 set URL=https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

echo Directory before
cd "C:\Program Files (x86)\Local\resources\extraResources\bin\wp-cli"
dir wp-cli*

wget %URL% -O wp-cli.phar --no-check-certificate
echo Directory after
dir wp-cli*
pause

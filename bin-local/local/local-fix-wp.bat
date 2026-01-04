@echo off
rem Fix Unix like Local scripts on Windows.

rem Must run as Administrator
rem Note: this change will get wiped out on the next Local update.

rem If you run wp or composer under a bash shell on Windows you will get an
rem error as the scripts have dos line endings. This script changes the scripts
rem to have unix line endings.

rem This is the case at least as of version 9.2.9. Hopefully they will fix it at
rem some point.

setlocal
cd C:\Program Files (x86)\Local\resources\extraResources\bin\wp-cli\win32
dir
dos2unix wp
dir
cd C:\Program Files (x86)\Local\resources\extraResources\bin\composer\win32
dir
dos2unix composer
dir
pause

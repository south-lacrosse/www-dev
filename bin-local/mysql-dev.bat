@echo off

rem Run SQL on the development server using its run-sql.sh script

rem Copy this file to somewhere on your path, and modify the paths for your environment
rem Requires some kind of Unix-like system, e.g. cygwin or WSL

rem If you are running Local you will need to set paths for MySql. Either use SET
rem here, or call the Local Site shell script (see docs\localwp.md for details)

rem setlocal
rem SET MYSQL_HOME=C:\Users\username\AppData\Roaming\Local\run\8NY41wnZV\conf\mysql
rem SET PATH=C:\Program Files (x86)\Local\resources\extraResources\lightning-services\mysql-8.0.16+6\bin\win64\bin;%PATH%

bash C:\Users\username\localwp\south-lacrosse\app\public\run-sql.sh %*

@echo off
rem Create self signed certificates for testing ssl apps

rem requires OpenSSL to be installed, which is in the latest versions of windows, or
rem can be done added using Cygwin, or download from https://www.openssl.org/

openssl req -x509 -out C:\local\httpd\conf\ssl\dev.southlacrosse.org.uk.crt -keyout C:\local\httpd\conf\ssl\dev.southlacrosse.org.uk.key ^
   -days 3650 -newkey rsa:2048 -nodes -sha256 ^
  -subj '/CN=dev.southlacrosse.org.uk' -extensions EXT -config  %~dp0dev.southlacrosse.org.uk.conf

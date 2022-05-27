@echo off
rem Example of creating self signed certificates for testing ssl apps with
rem multiple aliases. To add wildcards edit the multiple.conf file to add
rem *.whatever in alt_names

rem requires OpenSSL to be installed, which can be done added using Cygwin, or 
rem download from https://www.openssl.org/

openssl req -x509 -out C:\local\httpd\conf\ssl\southlacrosse.multiple.crt ^
  -keyout C:\local\httpd\conf\ssl\southlacrosse.multiple.key ^
  -newkey rsa:2048 -nodes -sha256 -days 3650 ^
  -config  %~dp0multiple.conf -extensions req_ext 

@echo off
rem Run a WP-CLI command in debug mode, will add the xdebug extension if needed
setlocal
set XDEBUG_MODE=debug,develop
>nul find "php_xdebug.dll" "%PHPRC%\php.ini" && (
  set option=
) || (
  set option=-dzend_extension=php_xdebug.dll
)
php %option% -dxdebug.start_with_request=yes "C:\Program Files (x86)\Local\resources\extraResources\bin\wp-cli\wp-cli.phar" %*


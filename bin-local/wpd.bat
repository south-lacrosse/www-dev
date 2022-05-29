@echo off
@rem Run a WP-CLI command in debug mode
setlocal 
set XDEBUG_MODE=debug,develop
set XDEBUG_CONFIG=client_port=9000
php -dxdebug.start_with_request=yes "C:\Program Files (x86)\Local\resources\extraResources\bin\wp-cli\wp-cli.phar" %*

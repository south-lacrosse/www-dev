@echo off
rem run wp-cli on the production website
wp.bat %* --ssh=sl:~/public_html

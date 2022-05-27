@echo off
rem run wp-cli on the staging website
wp.bat %* --ssh=sl:~/public_html/sub/stg

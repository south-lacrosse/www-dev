@echo off

rem To run you will need to install rsync from Cygwin, and enter you user/host information
rem and make sure the local media dir is correct (this file is using c:\local\southlacrosse-repos\www\media)

echo This will sync the media folder from the server to your local machine,
echo folder www\media. Note, this will delete any files
echo on the local machine which are not on the server.
pause
rsync --dry-run -rtvizP %1 --stats --exclude=".git/" --delete user@host:~/media/ "/cygdrive/c/local/southlacrosse-repos/www/media/"
pause
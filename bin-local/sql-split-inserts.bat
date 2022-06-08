@echo off

rem Modifies all sql files in a directory to put all row inserts on a new line,
rem rather than the usual gathering them up into 1 long string. This makes it
rem much easier to compare 2 sql files.

rem Requires sed to be installed, either from Cygwin or WSL, or run in a Git Bash shell

for %%f in (*.sql) do (
    sed -i -e "s$VALUES ($VALUES\n($g" -e "s$),($),\n($g" "%%f"
)

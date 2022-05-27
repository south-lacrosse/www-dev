#!/bin/bash

# Modifies all sql files in a directory to put all row inserts on a new line,
# rather than the usual gathering them up into 1 long string. This makes it
# much easier to compare 2 sql files.

for file in ./*.sql; do
    sed -i 's$VALUES ($VALUES\n($g' $file
    sed -i 's$),($),\n($g' $file
done
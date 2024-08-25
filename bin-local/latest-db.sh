#!/bin/bash
# Download latest database backup
file=$(ssh sl 'ls -t ~/public_html/bin/backups/db*.sql.gz | head -1')
[[ -z "$file" ]] && exit
scp "sl:$file" .

#!/bin/bash
# Export full prod DB and import into staging
~/public_html/bin/full-backup.sh full-www.sql
cd ~/public_html/sub/stg/
./bin/load-production-backup.sh ~/public_html/bin/backups/full-www.sql
echo Purging Litespeed Cache
wp litespeed-purge all

#!/bin/bash

# Load latest production database to development
# Either run from somewhere inside the WordPress folder, or pass in the
# WordPress directory

# Note: will not load history or current tables

if [[ $# -gt 1 ]]; then
	echo "Usage: $0 [wp-dir]"
	exit 1
fi

if [[ $# -eq 0 ]]; then
# Find WordPress in current dir or ancestors
	if [[ -f wp-config.php ]] ; then
		wp=.
	else
		dir=$(realpath .)
		wp=""
		while [[ -z "$wp" && -d "$dir" ]] ; do
			if [[ -f "$dir/wp-config.php" ]]; then
				wp="$dir"
			else
				dir=${dir%/*}
			fi
		done
		if [[ -z "$wp" ]] ; then
			echo "Cannot find WordPress directory. Run with $0 <wp-dir>"
			exit 1
		fi
		echo "Found WordPress in $wp"
	fi
else
	if [[ ! -d "$1" ]] ; then
		echo "$1 is not a directory."
		exit 1
	fi
	wp=${@%/} # remove trailing slash
	if [[ ! -f "$wp/wp-config.php" ]] ; then
		echo "$1 is not a WordPress directory."
		exit 1
	fi
fi

cd $wp || exit 1
latest_backup=$(ssh sl 'ls -t ~/public_html/bin/backups/db*.sql.gz' | head -1)
[[ -z "$latest_backup" ]] && exit
scp "sl:$latest_backup" bin/backups/

bin/load-production-backup.sh bin/backups/$(basename -- "$latest_backup")

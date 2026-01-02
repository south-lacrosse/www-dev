#!/bin/bash
# Display versions of relevant software in use. Enables easy matching of web
# server and local setups.

# function to indent results below
indent() { sed 's/^/  /'; }

if [[ $# -eq 0 ]]; then
	# see if currently in WordPress directory
	if [[ -f "wp-config.php" ]]; then
		WP=.
	# check default location
	elif [[ -f ~/public_html/wp-config.php ]]; then
		WP=~/public_html
	else
		echo "Must be run in the WordPress directory, or pass directory as argument."
		exit 1
	fi
else
	if [[ -f "$1/wp-config.php" ]] ; then
		WP=$1
	else
		echo "Unknown WordPress directory $1"
		exit 1
	fi
fi
source $WP/bin/db-creds.sh || exit 1
cd $BIN || exit 1

echo --------- PHP ---------
php -v | indent
echo --------- Database Client ---------
$MYSQL -V | indent
echo --------- Database Server ---------
$MYSQL --defaults-extra-file=.my.cnf -Bse "SELECT VERSION();" | indent
echo --------- WordPress ---------
wp core version | indent
echo --------- WP-CLI ---------
wp cli version | indent
echo --------- Composer ---------
# stderr contains PHP version and an info message. To list it change next line
# to `2>&1` to pipe it thru indent
composer -V 2>/dev/null | indent

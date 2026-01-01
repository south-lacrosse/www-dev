#!/bin/bash
# Display versions of relevant software in use
echo --------- PHP ---------
echo
php -v
echo
echo --------- Database ---------
echo
if command -v mariadb >/dev/null 2>&1; then
	mariadb -V
else
	mysql -V
fi
echo
echo --------- WordPress ---------
echo
if [[ $# -eq 0 ]]; then
	# in WordPress directory
	if [[ -f "wp-config.php" ]]; then
		wp core version
	else
		echo Cannot detect WordPress version. Must be in the WordPress directory, or pass directory as argument
	fi
else
	if [[ -f "$1/wp-config.php" ]] ; then
		wp core version --path="$1"
	else
		echo Unknown WordPress directory $1
	fi
fi
echo
echo --------- WP-CLI ---------
echo
wp cli version
echo
echo --------- Composer ---------
echo
composer -V

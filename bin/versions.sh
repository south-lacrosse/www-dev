#!/bin/bash
# Display versions of relevant software in use

indent() { sed 's/^/  /'; }

echo --------- PHP ---------
php -v  | indent
echo --------- Database ---------
if command -v mariadb >/dev/null 2>&1; then
	mariadb -V | indent
else
	mysql -V | indent
fi
echo --------- WordPress ---------
if [[ $# -eq 0 ]]; then
	# in WordPress directory
	if [[ -f "wp-config.php" ]]; then
		wp core version | indent
	else
		echo "  Cannot detect WordPress version. Must be in the WordPress directory, or pass directory as argument"
	fi
else
	if [[ -f "$1/wp-config.php" ]] ; then
		wp core version --path="$1" | indent
	else
		echo "  Unknown WordPress directory $1"
	fi
fi
echo --------- WP-CLI ---------
wp cli version | indent
echo --------- Composer ---------
# stderr contains PHP version and an info message. To list it change next line
# to `2>&1` to pipe it thru indent
composer -V 2>/dev/null | indent

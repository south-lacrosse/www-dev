-- You can extract all emails using:

-- bin/run-sql.sh clubs-emails.sql | grep -o "mailto:[^\"]\+" | sed -n "s/mailto://p" > emails.txt

-- use run-sql.sh from the WordPress bin dir, or use mysql-www/stg/dev

-- Extract all published club post content
SELECT ID, post_title, post_content
FROM wp_posts
WHERE post_type = 'clubs' AND post_status = 'publish'
ORDER BY post_title;


# Webmaster Tasks

Useful information about regular tasks the Webmaster should perform.

## Database

You should periodically make sure the database is performing well.

You can check the table sizes with `wp db size --all-tables --size_format=MB --decimals=2`, or use our [table-sizes.sh](../bin/table-sizes.sh) script.

There shouldn't be enough activity on our site to cause any problems, but it might be worth optimizing the bigger tables every now and then. You can do it in MYSQLAdmin if the host provides it by selecting the database so you get the list of tables, selecting the ones you want to optimize (there is a Check all button at the bottom), and at the bottom in `With selected:` pick optimize.

Alternatively run the MYSQL command line client with `mysql-www` and enter:

```SQL
OPTIMIZE TABLE `wp_options`, `wp_postmeta`, `wp_posts`;
```

You can also optimize the complete database with the command `wp db optimize`, though this is overkill.

Note you don't need this on `slc_` and `backup_` tables as these are recreated when the fixtures are reloaded.

## Email Authentication (DMARC) Failures

See [Email Authentication in Server Setup](setting-up-server.md#email-authentication) for information about email authentication, and how to set up the server.

You should monitor the `dmarc@southlacrosse.org.uk` email address to see if there are any problems. There are many solutions to do this.

## Broken Links

This probably only needs to be checked every couple of months. You should run this on a local copy of the website, so download the latest backup and load it using `bin/load-production-backup.sh`.

Note: `https://content.googleapis.com/` and `https://maps.gstatic.com/` will probably show up as errors. They are used in `<link rel='preconnect'>` tags so just refer to domains that should be looked up early, but most tools assume these are pages, and those URLs return 404s.

There are many ways to do this, but the following work well for Windows:

* [Xenu's Link Sleuth](http://home.snafu.de/tilman/xenulink.html) - old, but still good. Make sure to exclude `tel:` and `data:` URLs otherwise you will see excessive messages.
* [SEO Macroscope](https://nazuke.github.io/SEOMacroscope/blog/) - add the line `add_filter('pre_option_blog_public', function() { return '1'; },99);` into `wp-content/plugins/semla/semla.php` to test sitemaps (and don't forget to remove that line after!).

## Media Files

Media files (mainly images) may still exist after they are removed from any posts and pages. To check
which media isn't used any more run `wp semla-media unused`, and run `wp help semla-media unused` for the full options. If you are sure that it's OK to delete the unused files you can pipe the output from this command into `wp post delete`.

You should also run `wp semla-media attachments` to validate attachments and their metadata against the filesystem. You can run this with the `--delete` flag (again, **be careful**) to delete media files from the filesystem which WordPress doesn't know about.

See the `wp semla-media` command in the [Web Server docs](web-server.md#semla-wp-cli-commands) for details.

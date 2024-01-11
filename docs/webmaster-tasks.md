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

You should receive weekly DMARC summary emails to the Webmaster email address, which will alert you to any possible problems. For more details see [Email Authentication](setting-up-server.md#email-authentication) and [DMARC Monitoring](setting-up-server.md#dmarc-monitoring).

It should be noted that for DMARC to fail **both** SPF and DKIM must fail or not be aligned (the SPF/DKIM domain matches the From address).

You should occasionally check the `failed` folder of `dmarc@southlacrosse.org.uk` for any emails that cannot be processed.

## Search Console

You should have access to [Google Search Console](https://search.google.com/search-console?resource_id=sc-domain:southlacrosse.org.uk) (if you don't have access try switching user to your southlacrosse email using the icon in the top right). With the console you can see all details of Google searches, and other useful information such as mobile usability issues.

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

You may also want to check images that editors have uploaded in case you should optimize them. See the [Images help page](https://south-lacrosse.github.io/wp-help/images.html) and [Compression](developer-info.md#compression) for more details.

## Security

You should occasionally check the logs of the Limit Logins plugin to see if there are sustained attacks, and possibly [lock down access to wp-login.php](web-server.md#restricting-access-to-wordpress-login).

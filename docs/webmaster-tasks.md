# Webmaster Tasks

Useful information about regular tasks the Webmaster should perform.

## New Season Verification

There is a [Fixtures Verification Google Sheet](https://docs.google.com/spreadsheets/d/11LgFqD4acY9KPVCZQqu9i9PYwPC6qdfF3pHbhUncxb0/edit?usp=sharing) which will take the data from the [Fixtures Sheet](fixtures-sheet-format.md) and show the number of home and away games for each team in each competition. You will need to set the location of the Fixtures Sheet, and possibly change the formula in Data:A6 so you get the competition, home, and away columns on the Data sheet.

Note that this sheet may be private to the SEMLA Webmaster Google account, so you should share this if necessary.

Once the fixtures are loaded for the new season there are a couple of useful queries to check that teams have the correct number of games in the [src/sql folder](../src/sql/).

* [count-games.sql](../src/sql/count-games.sql) - count home and away games. Note it creates a `.tsv` file so it can easily be loaded into Google Sheets.
* [count-mids-games.sql](../src/sql/count-mids-games.sql) - count Midlands games where home and away count doesn't matter.

## Test New Releases Of WordPress

WordPress frequently release new versions, and the website is set to automatically update.

The only releases you really need to worry about are the major releases, which are versions with only 2 sequences, e.g. 6.7, 6.8, or 7.0, and not minor ones like 6.7.1 or 6.7.2. These are released every 4-5 months, and before they are WordPress will release beta and release candidate (RC) versions. You should test the site locally with RC versions when available, and you can do that with the [WordPress Beta Tester plugin](development-plugins.md#wordpress-beta-tester).

You can find out information about upcoming releases from [the WordPress releases page](https://wordpress.org/news/category/releases/).

One area you may miss is that if the blocks API has changed there might be deprecations or changes to functions our blocks use, or new versions of core blocks. The easiest way to check this is to open up the DevTools in your browser, go to the Console tab, and edit a club, page, and post. Any issues should be written to the console.

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

You can also run the [Broken Link Checker](https://wordpress.org/plugins/broken-link-checker/) WordPress plugin, though again this should be run on a local copy of the site.

## Media Files

Media files (mainly images) may still exist after they are removed from any posts and pages. To check
which media isn't used any more run `wp semla-media unused`, and run `wp help semla-media unused` for the full options. If you are sure that it's OK to delete the unused files you can pipe the output from this command into `wp post delete`.

You should also run `wp semla-media attachments` to validate attachments and their metadata against the filesystem. You can run this with the `--delete` flag (again, **be careful**) to delete media files from the filesystem which WordPress doesn't know about.

See the `wp semla-media` command in the [Web Server docs](web-server.md#semla-wp-cli-commands) for details.

You may also want to check images that editors have uploaded in case you should optimize them. See the [Images help page](https://south-lacrosse.github.io/wp-help/images.html) and [Compression](developer-info.md#compression) for more details.

## Security

You should occasionally check the logs of the Limit Logins plugin to see if there are sustained attacks, and possibly [lock down access to wp-login.php](web-server.md#restricting-access-to-wordpress-login).

## Calendars

Users can subscribe to the fixtures calendar for their team. However, if a team is renamed or folds then calendar apps will continue sending requests to our site, and there is no consistent way to stop these requests.

Our plugin handles this using the `sl_calendar_team` table, which has 2 columns, `alias` and `team`. Note that currently this table has to be modified manually.

1. For renamed teams add a row with `alias` = old name, and `team` = new name. The plugin will then simply serve the calendar for `team` whenever `alias` is requested.
1. For teams that have folded and whose calendar is used (check the `sl_calendar_log` table as below) add a row with `alias` = old name, and `team` = "REMOVED". Our plugin will then send an iCalendar file with a weekly event to remind the user to unsubscribe.

Unknown teams will otherwise send a 404 Not Found response code.

You should add these rows at the beginning of each season. You may also be able to remove rows from `sl_calendar_team` if they are no longer needed, just check the log table detailed below.

We log calendar requests to the `sl_calendar_log` table, which keeps track of the team requested, access count, first and last access time, and whether the request went to an alias or a removed calendar.

See also [useful calendar queries](../src/sql/calendars.sql).

# Backups

See also [Recovery](recovery.md).

## Strategy

Most of this site's files are stored in our GitHub repositories, so these can easily be recovered using standard Git commands. These repositories are:

* `south-lacrosse/www` - our plugin, theme, and other site specific files
* `south-lacrosse/media` (private repository) - media files
* `south-lacrosse/wordpress-config` (private repository) - WordPress configuration files

We don't include WordPress core or plugins as these all have their own version control mechanisms. Since they can be reinstalled so easily it isn't worth it to back them up, or store them in our own repositories. This also means that WordPress core and plugins can be automatically updated on the live server, which will mean any security issues will be patched quickly.

Then all we need to do is back up the database.

## Backing Up Configuration & Media Files

The following scripts check for any file changes, and if there are they will commit those changes, and push to the appropriate repository. They are all in `www/bin`

* `media-backup.sh` backs up all media files to `south-lacrosse/media`
* `config-backup.sh` backs up `wp-config.php` and `.htaccess` to `south-lacrosse/wordpress-config`
* `lscache-options-backup.sh` backs up LightSpeed cache options to `south-lacrosse/wordpress-config`. This only need to be run if the options have been changed (which is unlikely).

## Database Backups

See also [Off Site Backups](off-site-backups.md).

To understand the database backups you should be aware of what the tables are. The table name prefixes are:

* `slc_` - current season fixtures, can be recreated by importing fixtures
* `slh_` - historial data, e.g. all past league winners, only updated yearly
* `sl_` - anything else, like team name aliases
* `wp_` - WordPress tables, split into
    * WordPress core - things like posts, users etc.
    * Plugin specific tables. These are assumed to not need to be backed up. If they do then you should add them to `bin/regular-backup.sh`, and possibly other places.

Database backups are saved to the `bin/backups` folder.

The main backup script is `regular-backup.sh`, which backs up the WordPress core tables plus `sl_` tables. It has 3 modes, daily, weekly or monthly, and the file created is `db-{date}-{mode}.sql.gz`. These all run the same basic backup, the differences are in how many days backups are kept.

The weekly and monthly backups are copied [off site](off-site-backups.md). Monthly backups should also be manually copied to the SEMLA Webmaster's Google Drive folder `backups`.

We keep 8 days of daily backups, 35 days of weekly, and 366 days of monthly. That way we can recover even up to a year ago.

The script is usually run with no arguments in which case the script runs monthly if it's the 1st of the month, and if not then weekly for Mondays, and daily for everything else. If needed you can specify the mode as an argument to the script.

Other backup scripts are:

* `full-backup.sh` - full backup excluding tables created by plugins, so WordPress core tables plus `sl*`, which means `sl_`, `slc_` and `slh_`.
* `db-backup.sh` - runs various backups depending on the argument
    * `wp` - only WordPress core tables
    * `sl` - all `sl` tables, `sl_`, `slc_` and `slh_`
    * `slh` - SEMLA history tables `slh_`
    * `specific_table`

**Note that** except for `regular-backup.sh` these scripts will leave any backups in `bin/backups`, so you should tidy that up every so often.

## Automating Backups

Backups should be run using `cron` jobs. The cron format is `min(s) hour(s) day(s) month(s) weekday(s) command`, e.g.

```console
# Run daily cron jobs at 4:40 every day:
40 4 * * * command

# Run weekly cron jobs at 4:30 on the first day of the week:
30 4 * * 0 command

# Run monthly cron jobs at 4:20 on the first day of the month:
20 4 1 * * command
```

You can list what's scheduled with `crontab -l`, and update with `crontab -e`, although some hosts will only allow you to access cron via their control panel.

We recommended doing a daily backup of the database, config, and media files:

```console
40 2 * * * $HOME/public_html/bin/regular-backup.sh
10 2 * * * $HOME/public_html/bin/media-backup.sh
0 2 * * * $HOME/public_html/bin/config-backup.sh
```

If the cron job doesn't run under the user's login you will need to replace `$HOME` with your full home directory, e.g. /home/u01234567 (which is probably the safest thing to do anyway).

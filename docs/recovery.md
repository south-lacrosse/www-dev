# How To Recover From A Backup

Note: relative directory locations, e.g. `bin/backups`, are relative to the WordPress root, which at the time of writing is `~/public_html`.

It is assumed here that database recovery will use the scripts on the server. Of course you can also use the host's tools, e.g. PHPMyAdmin, and drop the `.sql.gz` file there.

## Backup Locations

Database backups are stored locally in `bin/backups`, and weekly & monthly backups are also stored in Google Drive under the SEMLA Webmaster account in folder `backups` (also accessible by the SEMLA President).

Media files are backed up to GitHub repository `south-lacrosse/media`.

Config files are backed up to GitHub repository `south-lacrosse/wordpress`.

These repositories are both private, but accessible from the south-lacrosse and semla-webmaster GitHub accounts, and from the web server via the command line.

The SEMLA plugin, theme, and other site specific files are stored in our GitHub repository at git <https://github.com/south-lacrosse/www>.

There should also be a complete copy of the production files for the staging subdomain, which will have its files in `sub/stg`. It may not be up to date, so recover from here with care, and of course never use its `wp-config.php`, as that will be completely different to the `www` domain version.

## Partial Restore

Use the standard Git mechanisms to restore anything which is stored in a cloned GitHub repository (our plugin & theme, media files). Note: if you are in the WordPress root directory, or any directory except `media`, then all Git commands will work on the `www` repository. Change into the `media` directory to work on that repository.

Useful Git commands are:

* `git status` - show any differences between the files and repository
* `git diff` - see all differences between files and repository
* `git checkout -- .` - checkout all Git managed files from the repository. It will overwrite any changes
* `git checkout -- my-file.php` - checkout a specific file

`wp-config.php` can be copy/pasted from the `south-lacrosse/wordpress` repository, or there should be a locally cloned version in `bin/backups/wordpress` where you can pull/checkout a known good version and just copy that to the WordPress root.

### Database Recovery

Check `bin/backups` for the backup you wish to use, or if that is corrupted or bad then get a backup from Google Drive.

If you need to restore the current fixtures/league tables (database tables `slc_`) then you can just run the fixtures sheet import again to recreate the tables.

Databases can be recovered by running `bin/restore-db.sh path/to/backup.sql.gz`.

There are several different types of backup you can load, and they should all have their creation date as part of the filename. The main ones are:

* `db-{date}-{mode}.sql.gz` - regular backups, which hold all WordPress core tables plus `sl_` tables. Mode will be daily/monthly/weekly, which is basically just a way to differentiate how long the backup is retained, and if it is copied to Google Drive, but the contents will be the same tables.
* `slh-{date}.sql.gz` - history tables. Since the history is only updated once a year there won't be many of these.

There may also be other backups, see the [Backups Document](backups.md#database-backups) for details.

To list backups on Google Drive for the last 2 weeks `rclone ls g:backups --max-age 14d`. Select the backup you want (the backup date is part of the file name). To copy a backup from Google Drive `rclone copy g:backups/backup.sql.gz .`.

We currently don't backup other plugin's tables, so if they need restoring then deactivate/activate it to get the plugin to recreate the tables it needs.

## Complete Restore

This following is the process to create a complete restore in a new directory, with a new database, which can then be used to replace your current site.

* Create a directory to work in, and go there

    ```bash
    mkdir ~/work
    cd ~/work
    ```

* Checkout the site from GitHub `git clone https://github.com/south-lacrosse/www`
* Install WordPress on top of that

    ```bash
    wget https://wordpress.org/latest.tar.gz
    tar -xzvf latest.tar.gz -C www --strip-components=1
    ```

* Get rid of the default plugins and themes you don't need. A sample interaction might be:

    ```bash
    cd www/wp-content/plugins
    ls -l
    rm hello.php
    rm -rf akismet
    cd ../themes
    ls -l
    rm -rf twentytwentyone
    ```

    Note that you should leave at least 1 non lax theme, just as a backup.

* Replace `wp-config.php` with the latest version in the `south-lacrosse/wordpress` repository.
* From the `www` directory add the media files with `git clone git@github.com:south-lacrosse/media.git`. Note that the repository must be cloned over SSH so that the automated backups can push changes to GitHub.
* Create a new database, and update `wp-config.php` with the credentials.
* Populate the database with with a backup by following the [Database Recovery above](#database-recovery)
* Reinstall all WordPress plugins. There is a script in <https://github.com/south-lacrosse/www-dev-private/blob/main/load-plugins.sh> to run WP-CLI to download all required plugins which you should run from the `www` directory. This is in a Private repository owned by the SEMLA Webmaster, so you will need access. Alternatively if you know all used plugins then you can `wp install <plugin-names> --activate`.
* The previous step may have changed the database, so just to be sure you should restore the database again using `bin/restore-db.sh backup.sql.gz`.
* Make sure all the files have the correct permissions. From the WordPress root run `bin/secure.sh` (you may have to set that to executable first)
* Switch out your old site by replacing the directory. e.g if your site was in `~/public_html/`

    ```bash
    mv ~/public_html/ ~/old_public_html/
    mv ~/work/www/ ~/public_html/
    ```

    Note we kept the old site in `~/old_public_html` just in case we need it.

Once you have tested everything and it is all working then backup your new `wp-config.php` file by running `bin/config-backup.sh`.

You can then tidy up with `rm -Rf ~/work`. Once you are sure you don't need the old site we saves in `old_public_html` then you can delete that too.

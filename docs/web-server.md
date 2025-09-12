# Web Server

## Hosting

Our current hosts are Hostinger, who use their own [hPanel](https://hpanel.hostinger.com/hosting/southlacrosse.org.uk/) server control panel. They were picked because they are a good, performant, cheap web host, which fits with the low usage requirements for the SEMLA site. They also use the LiteSpeed server which is more performant than the standard Apache, and also means cacheing is built in using the LiteSpeed Cache WordPress plugin.

Since it is a cheaper host there are some restrictions, so there is no `perl` or `ftp` available on the command line, and access logs are limited.

## Server Folder Setup

You can see the WordPress folder setup in [Design Notes](design-notes.md#folder-structure).

```txt
~
├── bin
└── public_html (main website)
    ├── bin (our WordPress project's bin dir. backup scripts etc.)
    │   └── backups
    ├── ...
    └── sub (subdomains)
        └── stg (staging site)
            ├── bin (our staging project's bin directory)
            └── ...
```

## Useful Scripts

The following should be in `~/bin`, but if not then [they are available here](../bin/).

* `www2stg.sh` - update the staging website from production (runs the next 2 scripts)
* `db-www2stg.sh` - copy the current production database to staging
* `media-www2stg.sh` - copy production media files to staging
* `mysql-stg` - run an SQL file on the staging database, or if there are no arguments then open a MySQL client
* `mysql-www` - the same, except for production
* `table-sizes.sh` - display size of all tables in the production database, so WordPress, fixtures, history etc.
* `website-versions.sh` - show which Git commits the production and staging websites are on

Note: both production and staging use the `south-lacrosse/www` Git repository, so to update the code use the normal Git commands.

## SEMLA WP-CLI Commands

See [Developer Help on WP-CLI](development-help.md#wp-cli-commands) for how to use WP-CLI, and note that if you have WP-CLI installed on your own PC and have SSH access to the server then you can run the WP-CLI commands remotely.

This project adds the following commands:

* `wp fixtures` - load fixtures from the Fixtures Google sheet. You should generally use the the SEMLA Admin menu as that purges fewer cached pages than the CLI version.
    * `update` - load the latest fixtures and flags, and generates league tables.
    * `update --all` - the same as `update`, plus it loads teams and divisions, which only needs to be done at the beginning of the season, or if the teams/divisions change.
    * `revert` - revert to last update, use as a last resort. Ideally you should fix the sheet.
* `wp history update|winners|stats` - Manage the history pages from the database. Should only be done as part of the [end of season processing](end-season.md).
* `wp purge current|history|menu`. We cache various objects, so if they cause a problem then you can purge them.
* `wp monitor` - monitor various WordPress functionality
    * `posts` - get a digest of post/page/club changes
    * `sessions` - get list sessions of logged in users
* `wp semla-media`
    * `attachments` - validate attachments and their metadata against the filesystem, and can also delete media files from the filesystem which WordPress doesn't know about.
    * `sizes` - updates the image size meta data in the database. Use this if you have optimized the images in the `/media` directory outside of WordPress.
    * `unused-images` - lists unused images. Adding `--format=ids` will just list the ids, so you can delete all these images with `wp post delete $(wp semla-media unused-images --format=ids)`, possibly with the `--force` flag, though you should be **very, very careful** when doing this as there may be false positives, and you can't undo this.

There may be commands that haven't been added to this documentation, so you can run `wp help <command>`.

## Restricting Access to WordPress Login

Bots are constantly trying to login to any server they can find on the internet. We use a plugin to limit the login attempts from any IP address, and Administrators can login to WordPress to see the logs to check if we are under sustained attack (50 login attempts per day isn't uncommon).

To further lock this down you can use the web server's access controls to only allow access to the login page from specific IP addresses.

To do this modify the `www\.htaccess` file to restrict access to `\wp-login.php`, e.g. the following only allows access from `1.1.1.1` and `2.2.2.*`, and any other IPs will receive a 403 error code. You can restrict access to specific IP addresses if really needed, but allowing access from certain IP address blocks will filter out 99.9% of the problem.

```apache
<Files "wp-login.php">
Require all denied
Require ip 1.1.1.1 2.2.2
</Files>
```

## Cacheing

We are currently using LSCache, the [LiteSpeed Cache for WordPress](https://docs.litespeedtech.com/lscache/lscwp/), as our host runs the LiteSpeed server.

To check if a page is cached you can use <https://check.lscache.io/>, or check the response headers for a `x-litespeed-cache` entry.

You can clear the cache (or parts of it) from the Litespeed Cache Admin page, or use their WP-CLI interface from the command line, e.g. `wp litespeed-purge all`. You can combine the purge command with other WP-CLI commands, e.g. `wp litespeed-purge post_id $(wp post list --post_status=publish --post_type=clubs --format=ids)` will purge all club pages.

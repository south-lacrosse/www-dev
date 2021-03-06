# Web Server

This file documents the setup of our web server. You can see the WordPress folder setup in [Design Notes](design-notes.md#folder-structure).

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
* `mysql-stg` - open a MySQL client to the staging database
* `mysql-www` - open a MySQL client to the production database
* `website-versions.sh` - show which Git commits the production and staging websites are on

Note: both production and staging use the `south-lacrosse/www` Git repository, so to update the code use the normal Git commands.

## SEMLA WP-CLI Commands

See [Developer Help on WP-CLI](development-help.md#wp-cli-commands) for how to use WP-CLI, and note that if you have WP-CLI installed on your own PC and have SSH access to the server then you can run the WP-CLI commands remotely.

This project adds the following commands:

* `wp semla fixtures update|update-all|revert` - load fixtures from the Fixtures Google sheet. Options are:
    * `update` - load the latest fixtures and flags, and generates league tables
    * `update-all` - the same as `update`, plus it loads teams and divisions, which only needs to be done at the beginning of the season
    * `revert` - revert to last update, use as a last resort. Ideally you should fix the sheet.
* `wp semla purge current|history|menu`. We cache various objects, so if they cause a problem then you can purge them.
* `wp semla history update-pages|stats` - Manage the history pages from the database. Should only be done as part of the [end of season processing](end-season.md).

There may be commands that haven't been added to this documentation, so you can run `wp help semla`.

## Cacheing

We are currently using LSCache, the [LiteSpeed Cache for WordPress](https://docs.litespeedtech.com/lscache/lscwp/), as our host runs the LiteSpeed server.

To check if a page is cached you can use <https://check.lscache.io/>, or check the response headers for a `x-litespeed-cache` entry.

You can clear the cache (or parts of it) from the Litespeed Cache Admin page, or use their WP-CLI interface from the command line, e.g. `wp litespeed-purge all`.

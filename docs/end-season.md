# End Of Season Processing

Part of the end of season processing needs to be run on the server, which you will need to access using SSH. You should already have SSH keys set up, but if not see the [Production Server](setting-up-server.md) docs.

## Overview

All historical data is stored in a series of database tables prefixed `slh_`.

The end of season process copies the current season's results, league tables, and flags, to their historical counterparts, and adds entries for those competition winners.

It then generates WordPress pages for all the historical data under their own `history` post type, which is basically every page you can access from [the History page](https://www.southlacrosse.org.uk/history). We do it this way as we can just generate all pages once a year, rather than having them access the data dynamically for every page view. The only history table actually accessed throughout the season is `slh-results`, as users can filter results by team/competition/date e.g. <https://www.southlacrosse.org.uk/history/results-2003>.

You should **always** run this process on a local or staging version of the website, and thoroughly test the results. Then you can backup the `slh_` tables from local/staging, load it into production, and then regenerate the WordPress history pages in production.

## Instructions

All executables are located in the `bin` directory under the relevant WordPress root. For the sake of this guide we will assume you will be running this process on the staging website, but it should be easily adaptable to running locally.

### Before You Start

All fixtures must have results, so for any missing fixtures mark them as `V - V` for void, or `C - C` for cancelled, or if the match without a result was a friendly you can just delete it. Then import the fixtures into the production website.

### Phase 1 - Copy Production to Staging

1. Make sure there is a backup of the history tables from last year. There should be one on Google Drive which you can check by `rclone ls g:backups --include "/slh-*"`. If not then run `bin/db-backup.sh slh`, and copy the resulting file to Google Drive with `rclone copy backup.sql.gz g:backups`.
1. Copy the complete production site to staging with `www2stg.sh` (make sure you say 'y' to the prompt). This does a full database backup, loads it into staging, and copies over any media files.
1. If you expect production and staging to have the same version of the SEMLA website specific code then run `website-versions.sh`. It might produce:

    ```txt
    Production is on Git commit:
    6cbf30f (HEAD -> main, origin/main, origin/HEAD) some commit message
    On branch main
    Your branch is up to date with 'origin/main'.

    nothing to commit, working tree clean

    Staging is on Git commit:
    5b29212 (HEAD -> main, origin/main, origin/HEAD) a different commit message
    On branch main
    Your branch is up to date with 'origin/main'.

    nothing to commit, working tree clean
    ```

    Here the production hash `6cbf30f` does not match staging. To checkout the same version in staging:

    ```bash
    cd ~/public_html/sub/stg/
    git checkout 6cbf30f .
    ```

    Obviously replace `6cbf30f` with the actual hash. Note: that will leave you in a detached HEAD situation, so remember to `git checkout <branch>` in staging after you have finished (and keep track of the staging branch name, in this case `main`).

If you need to you can always go back to this step by reloading the backup with `~/public_html/sub/stg/bin/load-production-backup.sh ~/public_html/bin/backups/full-www.sql`

### Phase 2 - Running The End of Season Process

Work for this phase should be done on the staging website, so `cd ~/public_html/sub/stg/bin`

1. In the staging database:
    1. Add competition winners other than flags or league (which are done automatically), so Varsity, sixes, National Championships, etc.. Since we are assuming the fixtures will be taken over by the EL system this has to be done by [manually editing the database tables](fixtures-tables-history.md#competition-winners).
    1. Make sure you have [added any remarks](fixtures-sheet-format.md#remarks-sheet) e.g. "Team x folded and their results are void", or "Competition void because of COVID", and have updated the fixtures to add them to the database.
1. The next step will update the history tables, and then the WordPress tables, so you should create backups of both with

    ```bash
    ./db-backup.sh slh
    ./db-backup.sh wp
    ```

    (restore either with `./restore-db.sh backups/backup.sql.gz`)
1. Get stats for the history database tables before the update with `wp semla history stats`. You should make a note of these figures somewhere, e.g. `wp semla history stats > backups/before-stats.txt`
1. Run the end of season process with `./end-season.sh`. This will update all the history tables, and create WordPress pages. If you get errors from this step then you will need to fix the them, restore the backups, and try again.
1. Run the stats again and compare to the before ones, and make sure they make sense. Note that some tables may add more rows than you expect, so `slh_tables` will add 1 row per team in each division. You should also make a note of these `wp semla history stats > backups/after-stats.txt` to compare to production later.
1. Check the results on the website. You should go to the history pages, and make sure competition winners have been updated, results for the year have been copied over, etc. And make 100% sure you aren't seeing cached pages because of Litespeed Cache.
1. Create a new backup of the history tables with `./db-backup.sh slh`, and make sure it is good by seeing if it's just a bit larger than last season's backup.
1. Copy it to Google Drive `rclone copy backups/slh-....sql.gz g:backups`

### Phase 3 - Moving the History to Production

Go back to the production bin directory `cd ~/public_html/bin`.

1. If you need to do a restore you can use the full backup we did when copying from production to staging, so `./restore.db backups/full-www.sql`. If the database has changed since then you should so a new full backup `./full-backup.sh`, and use that if you need to restore.
1. Load up the new history tables with `./restore-db.sh ../sub/stg/bin/backups/slh-...sql.gz`
1. Update the history pages with `wp semla history update-pages`
1. Run `wp semla history stats` to make sure it matches staging after stats.
1. Test everything to make sure it's OK.
1. If you did a Git checkout on the staging website remember to checkout the Git branch.

If you have to recover make sure you purge the Litespeed cache, otherwise visitors may see the incorrect cached pages. Either use the WordPress Admin dashboard, or from the WordPress directory `wp litespeed-purge all`.

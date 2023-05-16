# Information on Maintaining the Fixtures, Tables and History

**Important** Much of the functionality to maintain things like competition names, competition groups, team abbreviations etc. has been started, however since SEMLA are going to use the new England Lacrosse league functionality work on that has been stopped as it will be pointless. These unused programs can be found in `www\wp-content\plugins\semla\core\Admin`, and you will see which ones are unused as they will be commented out in `Admin_Menu.php`.

However, just in case we get to the end of the season without an EL platform here is information on how to maintain the required tables.

To update the database manually log into your web host, and they should have a simple way to update tables, usually PHPMyAdmin.

## Competitions and Groups

If there are any changes these tables will have to be maintained manually.

The relevant tables are:

`sl_competition`:

```sql
`id` smallint(6) unsigned NOT NULL AUTO_INCREMENT
`name` varchar(50) NOT NULL
`group_id` smallint(6) unsigned NOT NULL
`abbrev` varchar(20) DEFAULT NULL
`section_name` varchar(30) DEFAULT NULL
`seq` smallint(6) unsigned NOT NULL -- used to sequence
`type` varchar(20) NOT NULL
`ladder_comp_id1` smallint(6) NOT NULL -- set to id of 1st ladder division
`ladder_comp_id2` smallint(6) NOT NULL -- set to id of 2nd ladder division
`head_to_head` BOOLEAN NOT NULL -- e.g. varsity, or North v South
`history_page` varchar(200) NOT NULL -- history page to create, see below
`description` TEXT NOT NULL -- description to be shown on the history page
```

`history_page` is the slug used for the page generate for the list of winners
for that competition. It should be blank for leagues as they will be done on
group pages, and also
any competition which should not have a winners page.

If you add a new competition only set the `history_page` when you are running the end of season
processing as otherwise you will generate an empty page when running the history pages update.

`type` is:

* `league`
* `league-prelim` - a league that won't have a winner, usually a prelim like a qualifying conference
* `ladder` - a ladder where teams from different divisions play each other, with points applying to their respective divisions
* `cup`
* `results` - a list of winners, with possible runner-up, but no other data. Things like Varsity, Sixes

---

League and flag competitions should belong to groups, that way they can all be displayed on the same page. e.g. the Flags page and history will have Senior, Intermediate, and Minor.

`sl_competition_group` groups competitions, e.g. into SEMLA League, Local League, Flags:

```sql
`id` SMALLINT(6) unsigned NOT NULL AUTO_INCREMENT
`type` VARCHAR(20) NOT NULL
`name` VARCHAR(30) NOT NULL
`page` VARCHAR(200) NOT NULL
`history_page` varchar(200) NOT NULL
`grid_page` varchar(200) NOT NULL -- fixtures grid page for leagues
`history_group_page` BOOLEAN NOT NULL
`history_only` BOOLEAN NOT NULL
```

## Competition Winners

Winners go in `slh_winner`:

```sql
`comp_id` SMALLINT(6) unsigned NOT NULL -- sl_competition.id
`year` SMALLINT unsigned NOT NULL
`winner` VARCHAR(50) NOT NULL
`runner_up` VARCHAR(50) -- NULL if there is no runner up
`result` VARCHAR(20) -- can have things like '10 - 0 w/o'
`has_data` BOOLEAN NOT NULL -- 1 for league with table or flags with draw, 0 otherwise
```

Make sure team names match those used before, so check `slc_teams` for all current teams.

## History Pages

Since these pages only update once a year, they are all generated from the slh_* tables as part of the end of season process. To re-run manually, e.g. if you manually added any competition winners, connect to the server via SSH, navigate to the WordPress root directory if needed, and run `wp semla history update-pages`. If you have only updated the winners then you can also run `wp semla history update-winners`, which will be much quicker.

History pages are a separate post type, and currently aren't editable by anyone. To allow people to edit you will need to either change App.php in the SEMLA plugin to change the post type capabilities, or add the history capabilities to a role, e.g. using WP-CLI on the server `wp cap add administrator edit_histories edit_others_histories delete_histories publish_histories read_private_histories delete_private_histories delete_published_histories delete_others_histories edit_private_histories edit_published_histories`. Note that they will get overwritten by the `update-pages` process, and don't have revisions enabled.

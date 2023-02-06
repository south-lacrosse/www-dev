# Off Site Backups

Weekly and monthly backups are automatically copied to a FTP backup server using Rclone [(see below)](#configuring) as part of the [backup cron jobs](backups.md#automating-backups).

It should be noted that our hosts Hostinger do not have a suitable FTP client, so you will need to use `rclone` to access the FTP server. You can also access the backup server using an FTP client from any other machine. The settings can be found with `rclone config show backup` (but you'll need the password), and make sure you set `Explicit FTP over TLS` (or `ftps://`) so that the connection is secure.

## How to Recover and Backup

See also [all rclone commands](https://rclone.org/commands/). The name of the remote is `backup`.

Rclone paths are either `remote:path` or `/path/to/local` or `relative/local/path` or `C:\windows\path\if\on\window`. You cannot use wildcards in paths, instead [use filters](https://rclone.org/filtering/) such as `--include` or `--exclude`.  Copying can go in either direction.

* `copy` command. Does not transfer files that are identical in source and destination. `-P` shows progress.

    * `rclone copy backup:/db-2023-02-01-024001-monthly.sql.gz local-dest-dir/ -P` - recover a single file
    * `rclone copy backup:/ backups/slh-2022-05-13-105531.sql.gz -P` - backup a single file
    * `rclone copy backup:/ local-dest-dir/ --include="db*" -P` - copy included files from source folder to destination folder

* `rclone ls backup:/ --include="db*" --max-age 10d` - list files with pattern and max age. Use `lsl` to also include modification date.
* `rclone copyto backup:/db-2023-02-01-024001-monthly.sql.gz new-name.sql.gz -P` - copy a single file to a new name, will overwrite.

Useful flags for debugging are:

* Use `--dry-run` on all commands to see what would happen
* With `-v` rclone will tell you about each file that is transferred and a small number of significant events
* With `-vv` rclone will become very verbose telling you about every file it considers and transfers

## Configuring

We use [Rclone](https://rclone.org/) to backup files using FTP. It can be installed as a standalone program on shared hosting. If the server is AMD/Intel then:

```bash
mkdir -p ~/bin
curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip
unzip rclone-current-linux-amd64.zip
rm rclone-current-linux-amd64.zip
mv ~/rclone-v*-linux-amd64/rclone ~/bin
```

You can then edit your `~/.profile` (or whatever file is used on your server) to add `~/bin` to your path, if it isn't already.

The config is stored in `~/.config/rclone/rclone.conf`, so you can copy that if moving hosts.

The current off site backup process requires a remote FTP server to back up to, so if the current one becomes unavailable you will need to arrange another one.

You will need to know the FTP server host name, port, user and password, and hopefully that is uses TLS (explicit or implicit). Then follow the instructions at <https://rclone.org/ftp/> (basically just `rclone config` and follow the prompts), and set the name to `backup`, either  and either `Use Implicit FTPS (FTP over TLS)` or `Use Explicit FTPS (FTP over TLS)` to true (whichever the remote host uses).

Test it by listing files on the remote: `rclone ls backup:/`.

**Warning:** If you are backing up to a Hostinger server the FTP transfer will fail as the server certificate does not match the server name because Hostinger have `CN=*.hstgr.io` in their FTP certificates. To get around this you should find the `hstgr.io` address of the server as follows:

* Connect to the FTP server via SSH and run `set|grep HOSTNAME`, which should give you the host name like `uk-fast-web999.main-hosting.eu`
* Use the `hstgr.io` version of that host name, so `uk-fast-web999.hstgr.io`. Try pinging it so see that it works, and matches the IP address.
* If that fails try the following format: `srv999.hstgr.io`. If you `ping` that (or do a `nslookup`) it should tell you the server it redirects to, e.g. `Pinging uk-fast-web999.hstgr.io...`. Or just use that host name if the site resolves to the same IP address as our website. You can also get the server number by going into the hPanel and digging around (it'll be Server999 in the previous example). It should also be the URL if you go to Files->File manager.

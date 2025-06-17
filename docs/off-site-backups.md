# Off Site Backups

Weekly and monthly backups are automatically copied to a FTP backup server using Rclone [(see below)](#configuring) as part of the [backup cron jobs](backups.md#automating-backups).

It should be noted that our hosts Hostinger do not have a suitable FTP client, so you will need to use `rclone` to access the FTP server. You can also access the backup server using an FTP client from any other machine. The settings can be found with `rclone config show backup` (but you'll need the password), and make sure you set `Explicit FTP over TLS` (or `ftps://`) so that the connection is secure.

## How to Recover and Backup

See also [all rclone commands](https://rclone.org/commands/). The name of the remote is `backup`.

Rclone paths are either `remote:path` or `/path/to/local` or `relative/local/path` or `C:\windows\path\if\on\window`. You cannot use wildcards in paths, instead [use filters](https://rclone.org/filtering/) such as `--include` or `--exclude`.  Copying can go in either direction.

* `copy` command. Does not transfer files that are identical in source and destination. `-P` shows progress.

    * `rclone copy backup:/db-2023-02-01-024001-monthly.sql.gz local-dest-dir/ -P` - recover a single file
    * `rclone copy backups/slh-2022-05-13-105531.sql.gz backup:/ -P` - backup a single file
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

The current off site backup process requires a remote FTP server to back up to, so if the current server becomes unavailable you will need to arrange another one.

You will need to know the FTP server host name, port, user and password, and hopefully that is uses TLS (explicit or implicit). Then follow the instructions at <https://rclone.org/ftp/> (basically just `rclone config` and follow the prompts), and set the name to `backup`, and set either `Use Explicit FTPS (FTP over TLS)` or `Use Implicit FTPS (FTP over TLS)` to true (whichever the remote host uses, explicit is best).

Test it by listing files on the remote: `rclone ls backup:/`.

## Certificate Errors

It is possible the remote FTP server has a certificate that doesn't match the domain (Hostinger uses certificates with `CN=*.hstgr.io`) in which case `rclone` will fail.

To ignore certificate errors run `rclone config` and edit the config, accept all the previous values, say yes to `Edit advanced config?`, and set the option `no_check_certificate`.  Alternatively edit `~/.config/rclone/rclone.conf` and add the line `no_check_certificate = true` at the end of the backup config.

## Other Ways To Transfer Files

There are a few other Linux commands you can use to transfer files to and from a remote FTPS server. See other docs for [downloading with wget](development-help.md#download-files-with-wget) and [uploading and downloading with curl](development-help.md#downloading-and-uploading-with-curl).

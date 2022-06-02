# Setting Up The Production Server

Useful info in case we have to move to a new server.

Note: when we say to run a command that means you should connect to the server via SSH and run the command from there. The new hosts should provide the initial login details.

Since we don't want to be entering passwords all the time (and assuming you have [SSH keys set up](development-help.md#ssh-keys) for the old server), the first thing to do is copy over the authorised keys. You can just copy and paste or ftp `~/.ssh/authorized_keys` from the old server to the new. You should make sure that your SSH directory is secure by running:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

You might want to generate new keys, but copying over the old keys should be fine as they are the public keys, not the private ones.

Then [Install and Configure Rclone](rclone.md) to allow access to Google Drive.

It might be worth using the host's tools to install WordPress in the root so that the database is set up etc., but this guide assumes it's better to start from scratch.

If the old server isn't available then instead follow the instructions in the [recovery document](recovery.md).

You should configure `git` so that any commits will use the south-lacrosse-wp email.

```bash
git config --global user.name "SEMLA Webmaster"
git config --global user.email 106732683+semla-webmaster@users.noreply.github.com
git config --list
```

You might also want to copy over any useful aliases set up on the old machine. Either copy the relevant section in `~/.gitconfig`, or on the old machine run `git config --global --get-regexp alias` and you can add those on the new machine with `git config --global alias.xxx`.

To enable the server to push to the git repos you need to copy over the SSH keys and configuration, either ftp or copy-paste the following (or you might also generate new keys):

* `~/.ssh/config` - the ssh configuration file
* `~/.ssh/key_id_ed25519` - or similar, which will be the private key, see the config file for the name

And make sure the files are protected `chmod 600 ~/.ssh/*`.

You can test it's all working with `ssh -T git@github.com`

## Copying Files And Database Backup

First create a backup of the current database by running `bin/full-db-plus-semlacur-backup.sh`. This will create a backup in `bin/backups` which is excluded from the file copying process below for obvious reasons. To make sure the backup is copied you should move the file created to the `bin` folder.

We will copy everything over from the old site, including WordPress, plugins and themes, and the Git repository, using rsync. To do this there is a script in `bin/rsync-to-new-host.sh`.

You should first decide if there's anything you don't want to copy (e.g. caching directories) and add that to `bin/rsync-excludes.txt`. Then you should do a test run by going to the `bin` dir and running `./rsync-to-new-host.sh user@new-server-ip:dir -p port`, where new new server location is something like `u123458@1.2.3.4:~/public_html/`, and port is the SSH port of the server (if not default 22). A list of files which would have been uploaded will be in `backups/rsync.log`, so check that to make sure it looks OK.

If everything is OK then run the script again, but with `-go` on the end. It may take a while to complete, but once it does go to the new host and make sure the files are copied OK.

## Database

Create a MySQL database. Your host will have instructions on how to do this. Then edit `wp-config.php` and update the database credentials to those of the database you just created.

The copying step above will have copied a database backup that you can load by going to `bin` and running `restore-db.sh backup.sql.gz`.

## Other Configuration

You should check `wp-config.php` to make sure it looks OK. You should also check if there are any other changes you need to make by comparing the config file to `wp-config-semla.php`. You might want to [generate new Authentication Unique Keys and Salts](https://api.wordpress.org/secret-key/1.1/salt/).

Then test, and once you are sure everything is working:

* Backup your new `wp-config.php` file by running `bin/config-backup.sh`
* Make sure all the files have the correct permissions. From the WordPress root run `bin/secure.sh` (you may have to set that to executable first)

## HTTP Headers

Once everything is set up you should check to see what HTTP headers the server sends, as some headers set in `.htaccess` will be ignored in PHP files, depending on how they are run, so must be added in the PHP code.

You should first check the headers in `.htaccess` to see what's supposed to be sent, which will include something like:

```apache
Header always set X-Frame-Options "SAMEORIGIN" "expr=%{CONTENT_TYPE} =~ m#^text/html$#i"
Header always set X-Content-Type-Options "nosniff"
```

Then check the headers of a WordPress page to see if they are sent (you can do that using `curl -I`, or the developer tools in most browsers).

On Hostinger the X-Frame-Options header is ignored, but X-Content-Type-Options works.

For hosts which run php via fgci proxy all headers from `.htaccess` are ignored.

You should check which headers are used, and see if you need to update the SEMLA plugin - probably files App.php, App_Public.php, App_Admin.php, and Rest.php.

## Emails

You will need to migrate all email accounts over. We only use the host's email to forward emails to either personal accounts, or SEMLA GMail accounts, so you will just need to set up new forwarding accounts using the details from the old server.

You should also set up email authentication using SPF, DKIM and DMARC. This will stop any emails being regarded as spam. The new host should have SPF and DKIM records set up in their DNS, or have an easy way to to do so. You should also set up a DMARC record. See the current host for the setting, it should be under a DNS TXT record named `_dmarc`, probably something like `v=DMARC1; p=quarantine`. When setting up a new host you should monitor everything first, so the record should initially bee something like `v=DMARC1; p=none; rua=mailto:webmaster@southlacrosse.org.uk`.

You will also need to ensure that the GMail accounts use the new host's outbound servers to send email. In order to use the new servers before the domain is pointed to the new host you will need to add the new servers to the old server's SPF record - otherwise sent emails will be marked as spam. Not sure what to do about DKIM and DMARC as that wasn't set up the last time we moved servers, so you should research what to do. At worst you may have to disable DKIM and DMARC for a few days.

To set up a new outbound server for each GMail account:

* Go to GMail
* In the top right, click the gear icon (Settings), and then 'See all settings'.
* Click the Accounts and Import tab.
* In the 'Send email as' section, find the @southlacrosse.org.uk email address, and click 'edit info'
* Click 'Next Step'
* Enter the new SMTP Server, port (587), username = probably your full SEMLA email address, password, and hit 'Save Changes'

### WordPress SMTP Settings

We use WP Mail SMTP for sending mails from WordPress (automatic core/plugin/theme updates, password resets etc.), as the default method can be flaky, and will also cause SPF verification issues. You will need to make sure you set up the WordPress email account to the new server, and also update the plugin settings in WordPress. Go to the Admin dashboard, then WP Mail SMTP, update the `SMTP host` setting, and Save. The password is held in the `wp-config.php` file so as not to save it in the database.

## DNS Change

When you change the DNS records to point to the new host's nameservers you can use a useful too <https://www.whatsmydns.net/#A/www.southlacrosse.org.uk> to see where the change has propagated to.

## Scripts

There are probably some useful shell scripts in the old server's `~/bin` directory, so you should copy over whichever ones are useful.

## Finally

Once everything is set up and working then you should add [Automating Backups](backups.md#automating-backups).

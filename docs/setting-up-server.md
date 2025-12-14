# Setting Up The Production Server

Useful info in case we have to move to a new server.

Note: when we say to run a command that means you should connect to the server via SSH and run the command from there. The new hosts should provide the initial login details.

Since we don't want to be entering passwords all the time (and assuming you have [SSH keys set up](development-help.md#ssh-keys) for the old server), the first thing to do is copy over the authorised keys. You can just copy and paste or ftp `~/.ssh/authorized_keys` from the old server to the new. You should make sure that your SSH directory is secure by running `chmod 700 ~/.ssh;chmod 600 ~/.ssh/*`.

You might want to generate new keys, but copying over the old keys should be fine as they are the public keys, not the private ones.

It might be worth using the host's tools to install WordPress in the root so that the database is set up etc., but this guide assumes it's better to start from scratch.

If the old server isn't available then instead follow the instructions in the [recovery document](recovery.md).

You should configure `git` so that any commits will use the semla-webmaster email.

```bash
git config --global user.name "SEMLA Webmaster"
git config --global user.email 106732683+semla-webmaster@users.noreply.github.com
git config --list
```

You might also want to copy over any useful aliases set up on the old machine. Either copy the relevant section in `~/.gitconfig`, or on the old machine run `git config --global --get-regexp alias` and you can add those on the new machine with `git config --global alias.xxx`.

## Scripts

There are probably some useful shell scripts in the old server's `~/bin` directory, so copy over whichever ones are useful. They should include all the scripts in [this repos bin directory](../bin/), but if not then copy them over.

Check all the scripts in case you need to change directories for the new server layout.

Also check the `~/.profile` file (or whatever file the hosts use) as there may be useful settings you should copy, e.g. aliases such as:

```bash
alias stg="cd ~/public_html/sub/stg"
alias stg-bin="cd ~/public_html/sub/stg/bin"
alias www="cd ~/public_html"
alias www-bin="cd ~/public_html/bin"
```

## Configure SSH Keys For SEMLA Webmaster

To enable the server to push to the git `media` and `wordress` repos for backing up, and to pull the `fix` repo, you need to copy over the SSH keys and configuration. Either FTP or copy-paste the following:

* `~/.ssh/config` - the ssh configuration file
* `~/.ssh/key_id_ed25519` - or similar, which will be the private key
* Make sure the files are protected `chmod 600 ~/.ssh/*`.

You can test it's all working with `ssh -T git@github.com`

### Regenerating SSH Keys For SEMLA Webmaster

If you need to regenerate the keys just follow the [instruction on GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) for creating keys. Don't create a passphrase as otherwise the key can't be used from a batch script on the server.

Assuming you create file `semla-webmaster_id_ed25519` (and .pub), you need to put the private key on the web server, and the public key on GitHub.

* You should already have `~/.ssh` created as above
* Copy or cut & paste `semla-webmaster_id_ed25519` to `~/.ssh`
* Create an SSH config file `~/.ssh/config` with

    ```text
    Host github.com
        HostName github.com
        User git
        IdentityFile ~/.ssh/semla-webmaster_id_ed25519
        IdentitiesOnly yes
    ```

* And make sure the files are protected `chmod 600 ~/.ssh/*`.
* Follow the instructions to [add the public key to GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account), you'll use the `semla-webmaster_id_ed25519.pub` file. You should login to GitHub as `semla-webmaster`, the login information is in `SEMLA_Officers.xlsx` in the SEMLA Webmaster's Google Drive. It's shared with President, Secretary, and a few other officers, so just search for it in Google Drive. It is password protected, but the officers should have the password.

## Copying Files And Database Backup

First create a backup of the current database by running `bin/full-backup.sh`. This will create a backup in `bin/backups` which is excluded from the file copying process below for obvious reasons. To make sure the backup is copied you should move the file created to the `bin` folder.

We will copy everything over from the old site, including WordPress, plugins and themes, and the Git repository, using rsync. To do this there is a script in `bin/rsync-to-new-host.sh`.

You should first decide if there's anything you don't want to copy (e.g. caching directories) and add that to `bin/rsync-excludes.txt`. Then you should do a test run by going to the `bin` dir and running `./rsync-to-new-host.sh user@new-server-ip:dir -p port`, where new new server location is something like `u123458@1.2.3.4:~/public_html/`, and port is the SSH port of the server (if not default 22). A list of files which would have been uploaded will be in `backups/rsync.log`, so check that to make sure it looks OK.

If everything is OK then run the script again, but with `-go` on the end. It may take a while to complete, but once it does go to the new host and make sure the files are copied OK.

## Database

Create a MySQL database. Your host will have instructions on how to do this. Then edit `wp-config.php` and update the database credentials to those of the database you just created.

The copying step above will have copied a database backup that you can load with `mysql-www path/to/backup.sql.gz` (or `bin/run-sql.sh` if `mysql-www` isn't set up).

## Other Configuration

You should check `wp-config.php` to make sure it looks OK. You should also check if there are any other changes you need to make by comparing the config file to `wp-config-semla.php`. You might want to [generate new Authentication Unique Keys and Salts](https://api.wordpress.org/secret-key/1.1/salt/).

Also check `.htaccess` to see if you need any changes for the new hosts. You can always see `.htaccess-semla` for a base version which works.

Then test, and once you are sure everything is working:

* Backup your new `wp-config.php` and `.htaccess` files by running `bin/config-backup.sh`
* Make sure all the files have the correct permissions. From the WordPress root run `bin/secure.sh` (you may have to set that to executable first).

You should also [configure the off site backup](off-site-backups.md#configuring).

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

You will need to migrate all email accounts over. We mainly use the host's email to forward emails to either personal accounts or SEMLA GMail accounts, so you will just need to set up new forwarding accounts using the details from the old server.

You will also need to ensure that the GMail accounts use the new host's outbound servers to send email "From" the southlacrosse.org.uk domain. To set up a new outbound server for each GMail account:

* Go to GMail
* In the top right, click the gear icon (Settings), and then 'See all settings'.
* Click the Accounts and Import tab.
* In the 'Send email as' section, find the @southlacrosse.org.uk email address, and click 'edit info'
* Click 'Next Step'
* Enter the new SMTP Server, port (587), username = probably your full SEMLA email address, password, and hit 'Save Changes'

### Email Authentication

SPF, DKIM, and DMARC help authenticate email senders by verifying that the emails came from the domain that they claim to be from, which helps prevent spam, phishing attacks, and other email security risks. SPF uses DNS to publish the domains, subdomains and mail servers from which authorized email can be sent. DKIM uses DNS to advertise the public keys that can be used to authenticate email messages as having legitimately originated from the domain. DMARC uses DNS to publish what should happen if SPF and DKIM fail, which can be `none` (allow), `quarantine` (send to the spam folder), or `reject` to reject completely, which is the ideal setting (although some email providers will just send the email to spam).

It should be noted that for DMARC to fail **both** SPF and DKIM must fail or not be aligned (the SPF/DKIM domain matches the From address). So, emails which are resent from an email forwarding server like bounce.secureserver.net will pass SPF (for bounce.secureserver.net) but not be aligned (so overall SPF fail), but pass DKIM, and so pass DMARC, and be delivered to the user.

All website hosts should have SPF and DKIM set up, or have a way to easily do so. To setup DMARC the hosts may have a process, or you just need to add a DNS TXT record named `_dmarc` with the following content:

```text
v=DMARC1; p=reject; rua=mailto:dmarc@southlacrosse.org.uk
```

* `v` is the version
* `p` stands for policy, and should ideally be set to `reject`
* `rua` gives an email address for receiving email servers to send aggregate reports to, so that you can monitor your DMARC policy results.

Make sure you create the `dmarc@southlacrosse.org.uk` email account to receive DMARC reports.

You may want to set the DMARC policy to `none`, and then build back up to `quarantine` and `reject` as you monitor the effect of having a new server.

Not sure what to do about migrating DKIM, SPF and DMARC as they weren't set up the last time we moved servers, so you should research what to do, and update this document. At worst you may have to tell people not to send emails for a few days.

### DMARC Monitoring

If you have the `rua` tag set as above then aggregate reports will be sent to `dmarc@southlacrosse.org.uk`, but these will be in a user unfriendly zipped XML format.

To automate report handling we use [DmarcSrg](https://github.com/liuch/dmarc-srg), a PHP parser, viewer and summary report generator for incoming DMARC reports. Our setup sends a weekly summary email to the Webmaster, and also includes the web interface.

Emails to `dmarc@southlacrosse.org.uk` will be in the Inbox before they are processed, the `processed` folder if they were processed OK, or `failed` folder if they cannot be processed, so you should check this occasionally.

Processed emails and report data over a certain age are deleted by the clean up process.

When moving to a new server you should be able to just copy over the server directory and `dmarc_` database tables, and setup any `cron` jobs that were on the old server. You should make sure the `dmarc-srg/public` directory is somewhere accessible from a web server, probably as a subdomain with the root directory as `dmarc-srg/public`, and then password protect that directory (the host should have some way to do that).

To setup from scratch:

1. It's not essential, but it's useful to install DmarcSrg in a location accessible from the web. For the current server we installed it at `~/public_html/sub/dmarc-srg` so we could create a subdomain pointed to `~/public_html/sub/dmarc-srg/public`, and then used the hosts tools to password protect that directory.
1. From the directory you want to install to (replace 2.3 with the version you want):

    ```console
    wget https://github.com/liuch/dmarc-srg/archive/refs/tags/v2.3.tar.gz
    tar -xzvf v2.3.tar.gz --strip-components=1
    rm v2.3.tar.gz
    ```

    If you want the latest version you can run the following. Note that unzip doesn't remove the top level directory, so the files will be contained in subdirectory `dmarc-srg-master` (or similar).

    ```console
    wget https://github.com/liuch/dmarc-srg/archive/refs/heads/master.zip
    unzip master.zip
    rm master.zip
    ```

1. To install dependencies you can use Composer, which should be installed on the host (if not there are plenty of tutorials on how to install it on shared hosting). You should check the installed version using `composer -V` as it is possible some hosts will have `composer` for Composer version 1, and `composer2` for the latest version.

    You can just run `composer update --no-dev` to install all runtime dependencies, however in the current version we don't need them all (PHPMailer to send emails via SMTP, and ImapEngine to access an IMAP mailbox), so assuming that remains the case then from the install directory run:

    ```console
    rm composer.*
    composer require phpmailer/phpmailer directorytree/imapengine
    ```

1. Create and populate `config/conf.php`, based on the `dmarc-srg/conf.php` file from our private `wordpress-config` repo. You should use the same database as the production WordPress so that it's easier to backup. If you make changes then ensure you also commit and push those changes back to the `wordpress-config` repo.
1. `chmod 0600 config/conf.php` so the config file isn't readable by anyone else.
1. In the `dmarc-srg` directory run `php utils/database_admin.php init` to create the tables.
1. Create a set of `cron` jobs (see below) to process the reports and do any administration. The programs need to run from the `dmarc-srg` directory, so if you are running the programs outside of our supplied shell scripts they should be run using something like `cd path/to/dmarc-srg && php utils/fetch_reports.php`

The cron format is `min(s) hour(s) day(s) month(s) weekday(s) command`, so a suggested setup would be:

```text
# Get reports from the email account daily at 3am. The latest reports will be
# available daily in the web interface.
0 3 * * * path/to/wordpress/bin/dmarc-fetch-reports.sh

# Send a weekly report email on Monday at 3:15am, backup the dmarc database, and
# clean up old backups.
15 3 * * 1 path/to/wordpress/bin/dmarc.sh

# Clean up email account and dmarc database on the 1st of the month. See the
# config file for the number of days to keep.
30 3 1 * * path/to/wordpress/bin/dmarc-cleanup.sh
```

Note: the `bin\dmarc*.sh` scripts assume DmarcSrg is installed in `sub/dmarc-srg` inside the WordPress directory.

### WordPress SMTP Settings

We use SMTP for sending mails from WordPress (automatic core/plugin/theme updates, password resets etc.), as the default method can be flaky, and will also cause SPF verification issues. You will need to make sure you set up the WordPress email account on the new server. The mailbox user and password are held in the `wp-config.php` file so as not to save them in the database.

## DNS Change

When you change the DNS records to point to the new host's nameservers you can use a useful tool <https://www.whatsmydns.net/#A/www.southlacrosse.org.uk> to see where the change has propagated to.

## Finally

Once everything is set up and working then you should add [Automated Backups](backups.md#automating-backups).

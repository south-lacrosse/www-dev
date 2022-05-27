# Rclone

## Install

[Rclone](https://rclone.org/) is used to manage files in cloud storage, in our case access backup files on Google Drive. Rclone can be installed as a standalone program on shared hosting. If the server is AMD/Intel then the following will install Rclone:

```bash
mkdir -p ~/bin
curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip
unzip rclone-current-linux-amd64.zip
rm rclone-current-linux-amd64.zip
mv ~/rclone-v*-linux-amd64/rclone ~/bin
```

You can then edit your `~/.profile` to add `~/bin` to your path, if it isn't already.

## Configure

Full instructions are at <https://rclone.org/drive/>. We have already set up a client id & secret, so you should log into the [Google API Console](https://console.developers.google.com/) using the SEMLA Webmaster account, select the Project `API Project`, go to `Credentials` and click the OAuth 2 Client `Desktop client 1` and find the `Client Id` and `Client Secret`.

For connections to Google Drive to work the "OAuth consent screen" must either be published, or it can be left in test, with the Webmaster added as a test user.

Execute `rclone config` to bring up the config menu, and then:

* Add a new remote with `n`
* Name it `g`
* Select Google Drive by entering `drive`.
* Enter the `client_id` from above
* Enter the `client_secret` from above
* Enter `3` for the `scope` so we only have access to files created by rclone. You will not be able to see files or directories created outside of rclone.
* Leave everything blank until you get to `Use auto config?`
* Enter `n`, and follow the instructions to get a config token. Then, copy and paste the code you get back into the terminal window.
* Reply `n` to 'Configure this as a Shared Drive (Team Drive)'

Once done, you confirm the information with `y` then press `q` to quit the config.

You can then access the Google Drive with rclone, e.g. list directories with `rclone lsd g:backups`. And remember, you will only be able to see files created using rclone unless you set the scope to otherwise.

## Reconnecting

If rclone loses the the connection, you can reconnect with:

* `rclone config reconnect g:`
* Reply `n` to `Use auto config?`
* Go the the URL specified, log in using the SEMLA Webmaster account to grant authorisation. Then, copy and paste the code you get back into the terminal window
* Reply `n` to `Configure this as a Shared Drive (Team Drive)?`

## Commands

See also <https://rclone.org/commands/>.

* Use `--dry-run` on all commands to see what would happen
* With `-v` rclone will tell you about each file that is transferred and a small number of significant events
* With `-vv` rclone will become very verbose telling you about every file it considers and transfers
* `rclone ls g:backups --include="db-full-daily-*sql.gz" --max-age 3d` - list files with pattern and max age. Use `lsl` to also include modification date. Note you cannot add the pattern on the end of `g:backups` as that is a directory name.
* `rclone copy my-file.txt g:backups` - copy a file or directory, can go in either direction
* `rclone copy --max-age 24h --no-traverse /path/to/src remote:` - if you have many files in /path/to/src but only a few of them change every day, you can copy all the files which have changed recently very efficiently like this

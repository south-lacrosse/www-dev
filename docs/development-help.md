# Development Help File

This file contains useful info for development - probably mainly stuff I would forget if not written down! Kept out of the main README file as this is technical info which may be known by developers already - and in any case can be found with a bit of Googling.

## Git Commands

### Remote repos

* `git remote -v` - see what remote repos are linked
* `git remote add origin git@github.com:username/new_repo` - add remote repo (assumes connecting via SSH)
* `git remote set-url origin new.git.url` - change remote repository

If you want to pull from multiple remotes of the same repo first do a `git remote add` as above, then:

* `git fetch remote-repo` - download objects and refs from remote. You probably need to do this before first checkout from the new remote.
* `git checkout -b repo2-branch repo2/branch` - if you already have `origin/main`, you can get the same branch from repo2 with name `repo2-branch`. You can switch back to `origin/main` with `checkout main`.

    Then `git pull` should work on whichever branch you have checked out, but if you hit problems then try a `git fetch`

### Branches

* `git checkout -b <new-branch> [<start-point>]` - create a new branch and check it out, start point is optional
* `git branch` - list branches, default to local. Useful options:
    * `-v` lists current commit, `-vv` also lists the linked remote branch
    * `-r` for remotes
    * `-a` for all
* `git push -u origin <branch>` - pushes and sets default upstream branch
* `git merge main` - merge current branch with another
* `git pull --prune` to tell git to discard all local pointers to remote branches which do not exist any more (works with `fetch` or `fetch --all` too)
* `git reset --hard origin/main` - force an overwrite of local files with the specified commit/branch. Be careful as any uncommitted local changes tracked files will be lost!
* To merge a branch into another, while squashing it to 1 commit

    ```console
    git checkout main
    git merge --squash bugfix-branch
    git commit
    ```

    Omitting the -m parameter on the commit lets you modify a draft commit message containing every message from your squashed commits before finalizing your commit.
* Deleting a branch on both local and remote repos

    ```console
    git branch -d <branch-name>
    git push --delete <remote-name> <branch-name>
    ```

    Use `-D` if branch has unmerged changes.

### Commits

* `git add .` - add all files in and below current directory to index. Use `git add -A` to add everything in the repository's directory.
* `git commit -am "message"` - commit with a message. The `-a` flag (all) automatically stages files that have been modified and deleted, but new files you have not told Git about are not affected.
* `git log -S search-string` - search for commits that reference search-string, so will show any commit that added or removed a reference to a specific function.
* Undoing commits (don't do if you've pushed to a repo that others may have pulled from).
    * `git reset --soft "HEAD^"` - undo the last commit (and everything staged), but leave the working directory intact.
    * `git reset --hard "HEAD^"` - delete the last commit, and reset working directory to the previous commit. Be careful with this one!
* `git rebase --committer-date-is-author-date -i HEAD~10` - interactive rebase. Opens up an editor with a list of commits, and you can pick which commits to keep. Git then applies the remaining commits one-by-one from the starting point you specified, effectively deleting the removed commits. `HEAD~10` could also be a commit e.g. `ad14bf3`.

    On a rebase author date is preserved, but committer date is modified. There is no way to preserve the committer date, but you can do the next best thing and `--committer-date-is-author-date`.

    Again, be careful. Should never be done on a `main` branch that has been pushed.
* `git rebase --keep-base -i main` - rebase on to the base commit from main that the branch was created from. Useful for feature branches with many commits if you are trying to rebase or commit into main and are getting lots of conflicts in different commits. With this command you squash the commits into one, and can then deal with all the conflicts at once. The `-i` will open an editor, so change all commits apart from the first from "pick" to "s" for squash or "f" for fixup (docs will be in the editor).
* `git cherry-pick <SHA-1>...<SHA-1> --no-commit` - apply commits from another branch

### Stashing

* `git stash [-m message]` stash the changes in a dirty working directory away, so you can do things like switch to another branch
* `git stash pop` restore the stashed changes, and remove from the stash list
* `git stash apply` restore the stashed changes, but leaves on the stash
* `git stash list` see what's stashed
* `git stash drop <stash_id>` - delete a stash
* `git stash clear` - delete all stashes

### WorkTrees

This allows you to checkout more than one branch from the same repo, so you can work on multiple branches simultaneously without having to switch between them. The branch must be different to the one currently checkout out.

* `git worktree add ..\www-main main` - create a worktree in `..\www-main` for branch `main`
* `git worktree remove ..\www-main` - remove it

### Config

* `git config --global user.name <name>` - set user name for commits.
* `git config --local user.email <email>` - set email for commits. Can be global or local.

### Handy Aliases

```bash
git config --global alias.lol "log --oneline --graph --decorate"
git config --global alias.tree "log --oneline --decorate --all --graph"
git config --global alias.commit-files "show --pretty= --name-status"
```

Which will enable you to enter:

* `git lol` - short for "log one line", will display a condensed log format
* `git tree` - show commit logs, including those on other branches, in a nice tree format
* `git commit-files [commit]` - list files and their modification status (A/M/D) from a specific commit

### Tags

Tags are useful for marking milestones or releases.

* `git tag v1.0.0` - create a tag
* `git push origin v1.0.0` - tags don't get included in any push, and must be pushed explicitly. `origin` is the remote repo alias
* `git tag -d v1.0.0` - delete local tag
* `git push --delete origin v1.0.0` - and to delete from a remote repo

### File Permissions

To mark a file as executable on Windows `git update-index --chmod=+x foo.sh`. You'll then need to commit. To list file permissions `git ls-tree HEAD foo.sh`, and for staged files use `git ls-files -s`.

### Creating a New Git Repository

* On GitHub use the web interface and clone locally, or use the GitHub Desktop.
* Alternatively to create a new repo on a non-GitHub Linux server: go to the required directory and `git init --bare test_repo.git`, and clone locally `git clone user@host:~/git/repo.git`.
* For a local repo run `git init` in the root code directory
* To connect local repo to a remote `git remote add origin git@github.com:username/new_repo`. URL will be specified in GitHub, or if loading from our own server then `user@host:~/git/repo.git` where the user has `ssh` access.

## SSH Keys

If you find yourself regularly having to enter your password when connecting to our web server or Github then you should probably set up SSH keys so you don't have to. You can create a public/private SSH key pair locally, copy the public key to the server, and then you can authenticate using your private key. There are plenty of [guides on the internet](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

You will want to create a passphrase so that your SSH key is protected even if someone has access to the file. To stop you having to enter the passphrase every time you use the key you can store the password in the SSH Agent. On Windows you should open `Services` and start `OpenSSH Authentication Agent`, and set it to start automatically.

You will probably want to set up the SSH config file too, so that you can reference the server as `sl` rather than `user@southlacrosse.org.uk:123`. The config file is `%HOME%\.ssh\config` on Windows, and `~/.ssh/config` on other systems. And you should make sure it and any keys are only readable by the current user.

A suggested entry would be:

```text
Host sl
    HostName southlacrosse.org.uk
    Port <port>
    User <user>
    IdentityFile ~/.ssh/your_ed25519_private_key   (~/ also works on Windows)
    IdentitiesOnly yes
```

## Multiple GitHub Accounts

If you want to be able to push to 2 GitHub accounts from the same client, for example you already have a work account and want to develop under a personal account, there are 2 options.

The best solution is to have an SSH key for each account. There are plenty of articles on how to do this, [this one works](https://stackoverflow.com/questions/4220416/can-i-specify-multiple-users-for-myself-in-gitconfig) (though you need to scroll down a couple of answers). You should use the ed25519 type instead of the default rsa, so `ssh-keygen -t ed25519 ...`. On Windows you need to change the OpenSSH Authentication Agent service so that it starts automatically, and is running, and add the environment variable `GIT_SSH=C:\WINDOWS\System32\OpenSSH\ssh.exe`. When you connect to GitHub over SSH you may get "The authenticity of host 'github.com (140.82.121.4)' can't be established.", in which case you can [check the fingerprint here](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/githubs-ssh-key-fingerprints).

Alternatively you can just set the email for the current repo with `git config user.email 123456+user@users.noreply.github.com`, and then if your other account has a Personal Access Token and write access to the repo then pushing will use the 123456+user email address to link to the correct user.

## Debugging PHP Using Xdebug

To debug in [VSCode](vscode.md) click the Run and Debug icon, and pick `Listen for Xdebug` from the dropdown list (configured in `www-dev\.vscode\launch.json`). See the VSCode site for [more information about debugging](https://code.visualstudio.com/docs/editor/debugging).

If you are using Local make sure Xdebug is switched on for the site.

If you have set `xdebug.start_with_request=trigger` (the default, but overridden in Local) then you should install an [Xdebug browser extension](https://xdebug.org/docs/step_debug#browser-extensions) to control when the debugger is called.

And don't forget to set a breakpoint!

## Linux Commands

### Bash

* `CTRL + R` - search backwards through your command history
* `history | grep command` - find a command in your history

### Backing Up/Copying Files

To copy the complete WordPress files, including plugins, themes, Git repos etc you can use `rsync`.

To copy the production files, go to the WordPress base directory e.g. `cd ~/public_html`, and run

```bash
rsync -av --exclude-from=bin/rsync-excludes.txt --dry-run . ~/public_copy
```

Remove the `--dry-run` option when you are satisfied with the results. You can exclude the large Git directories with `--exclude='.git/'`.

Check `rsync-excludes.txt` for excluded files, but it should include `sub/*/` so as not to copy any subdomains.

You can also use `rsync` to copy to/from a remote machine using `ssh`.

### Rsync Options

The most useful ones are:

* `--dry-run` or `-n` to test
* `--delete` delete extraneous files from dest dirs
* `-d` `--dirs` transfer directories without recursing
* `-i` output a change-summary for all updates (itemize-changes)
* `-p` preserve permissions (probably not needed)
* `-P` same as --partial --progress
* `--progress` show progress during transfer
* `--partial keep` partially transferred files, allows restarting
* `-r` recursive
* `-t` preserve modification times
* `-v` verbose
* `-z` compress - useful for text files, but not needed if files already gzipped

#### Possible Rsync Issues On Windows Cygwin

When running `rsync` you may get `error in rsync protocol data stream (code 12)`. One cause of this is when the version of `ssh` (which it uses to communicate with the server) doesn't match what `rsync` needs. If this is the case the fix is to make sure the cygwin `ssh` is higher up the path than the Windows version, so do something like `set PATH=C:\local\cygwin64\bin;%PATH%`.

If you are using SSH keys you will need to make them available in cygwin. The easiest way is to set your cygwin home directory to be the your Windows home (`%HOME%`, or `C:\Users\{user}`). To do that edit `/etc/nsswitch.conf` and add:

```text
db_home: /%H
```

Alternatively copy them from `%HOME%\.ssh` to your cygwin `~/.ssh` directory, which will be `cygwin-dir\home\username\.ssh`.

If that works then you may find an issue with always having to re-enter passphrases. You can run the cygwin `ssh-agent` to handle this (though you'd have to run this every session, and re-enter the passphrase, though only once until you stop the `ssh-agent`), but if you already have passphrases in the Windows `ssh-agent` you can forward the cygwin requests to that instead. To do that:

* Download [npiperelay](https://github.com/jstarks/npiperelay) and put it somewhere on your path
* Install `socat` in cygwin if needed
* Create a batch file called something like `ssh-agent-forwarding.bat`:

    ```bat
    socat UNIX-LISTEN:/tmp/openssh-ssh-agent-pipe,umask=066,fork EXEC:"npiperelay -ei //./pipe/openssh-ssh-agent",pipes &
    ```

Then, before you run `rsync` run that batch file (it will leave a window open, close it once you're done), and from the command line enter `set SSH_AUTH_SOCK=/tmp/openssh-ssh-agent-pipe` so your current session knows where to look (or add it to your batch file).

Make sure you use `Ctrl-C` to terminate `socat`, otherwise it won't clean up the `/tmp/openssh-ssh-agent-pipe` file. If you try to run `socat` and it fails with `socat... E "/tmp/openssh-ssh-agent-pipe" exists` you will need to delete that file (it'll be under your cygwin directory), though make sure it isn't already running first!

### Deleting Files

* ``rm `ls -t db-wp-*.sql.gz| awk 'NR>5'` ``- delete all but the most 5 recent matching files (just run the `ls` to see what would be deleted!)
* `find backups/ -maxdepth 1 -name "db-wp-*.sql.gz" -type f -mtime +30 -delete` - delete matching files older than 30 days (run without the `-delete` argument to test)

### Editing Files With sed

By default sed outputs to standard out. Include the `-i` flag after sed to modify the file itself (edit in-place).

* `sed '/PATTERN-1/,/PATTERN-2/d' input.txt` - delete lines between patterns, including those lines
* `sed '/PATTERN-1/,/PATTERN-2/{//!d}' input.txt` - this time excluding those lines
* `sed '/PATTERN-1/,$d' input.txt`- delete all the lines after a pattern
* `mysqldump ... | sed 's$VALUES ($VALUES\n($g' | sed 's$),($),\n($g' | gzip ...` - have output of mysql dump have all row inserts on separate lines. You can also see [a script to do this to all .sql files in a directory](../src/sql/inserts-on-new-lines.sh). This is really useful if you want to compare SQL files.

### Download Files With wget

* `wget -x https://dev.southlacrosse.org.uk/robots.txt`- `-x` aka `--force-directories`, create a hierarchy of directories, even if one would not have been created otherwise, so this will create file dev.southlacrosse.org.uk/robots.txt
* `wget --force-directories --no-check-certificate --input-file=dev-urls.txt` - download URLs in file, creating directories. Get [site URLs from WP-CLI](#site-urls).

Useful options:

* `-nv` or `--no-verbose` - reduce noise
* `--user-agent=Mozilla` or `-U` - use a standard user agent to stop sites blocking wget
* `--no-check-certificate` - don't check certificates, including self-signed certificates, which can be useful if running locally
* `--limit-rate=20k --wait=60` - be nice to the server
* `--random-wait` - wait from 0.5\*WAIT...1.5\*WAIT secs between retrievals
* `--execute robots=off` - force wget to ignore the robots.txt and the nofollow directives
* `--no-directories` or `-nd`, prevents wget from creating a hierarchy of directories

## Npm Commands

* `npm i` - install local node modules as defined in config files `package.json`/`package-lock.json`
* `npm i <package_name> --save-dev` - or `-D`, install a package for development, and save to `devDependencies` `package.json`
* `npm i <package_name>` - install a package, and save to `dependencies` in `package.json`
* `npm i <package_name> -g` - install a package globally, i.e. it can be accessed from the command line, and is installed in a globally available node directory, and not `/node_modules`
* `npm outdated` - see what packages are out of date, can add `-g` option to see global packages
* `npm update <package_name>` - update a specific package, or all if `package_name` is empty. Won't install newer major versions, so 1.9.9 won't be updated to 2.0.0. To do that you need the next option.
* `npm i <package_name>@latest --save-dev` - install latest version of a specific package

`package-lock.json` contains a list of all installed packages, their versions, and the versions of their dependencies. That way when someone else install the npm packages they will get the exact same version. To update packages you normally do `npm update` as above.

To reinstall with the most recent update (will not install newer versions, so 1.9.9 won't be updated to 2.0.0) then delete `package-lock.json` and run `npm i`.

To reinstall to the absolutely latest version, delete `package-lock.json` and delete the `devDependencies` section from `package.json`, then run `npm i <packages> --save dev` for all the packages used, which as time of writing would be `npm i @wordpress/icons @wordpress/scripts autoprefixer cross-env inline-source-cli npm-run-all postcss postcss-cli postcss-csso svgo uglify-js --save-dev`.

You can update node itself from the command line in Linux, but for Windows & Mac you need to download a new installer.

### Npm Scripts

You will note a few scripts use `cross-env-shell`. This is because there is no built-in cross-platform way of accessing environment variables from npm scripts. We could have created Unix & Windows scripts, but it's simpler to use `cross-env-shell` e.g.

```json
"scripts": {
  "hi:unix": "echo $npm_config_www",
  "hi:windows": "echo %npm_config_www%",
  "hi:cross-platform": "cross-env-shell echo $npm_config_www"
}
```

Note: `npm_config_*` gets values from the `.npmrc` config file.

## WP-CLI Commands

The WordPress command line interface is a very useful tool. See [full list of commands](https://developer.wordpress.org/cli/commands/).

WP-CLI will also work remotely by specifying an SSH host with the `--ssh` option, e.g. if you have our server set up as a Host sl in your `~/.ssh/config` file then `wp plugin list --ssh=sl:~/public_html` will list plugins on the production website, or if not then `--ssh=user@southlacrosse.org.uk:<port>~/public_html`. [See also the WPL-CLI guide](https://make.wordpress.org/cli/handbook/guides/running-commands-remotely/).

### Plugins

* `wp plugin install plugin-names --activate`
* `wp plugin activate plugin-name` (or deactivate if needed!)

### Search-Replace

`wp search-replace old new`. [Search/replace](https://developer.wordpress.org/cli/commands/search-replace/) intelligently handles PHP serialized data, and does not change primary key values.

### Site URLs

Combine with [wget](#download-files-with-wget) to download portions of the website.

* `wp post list --field=url --post_type=any --post_status=publish` - list all URLs on the site. Since the `history` post type is excluded from search it will be omitted from this list.
* `wp post list --field=url --post_type=post,page,clubs,history --post_status=publish > dev-urls.txt` - list ALL URLs and save to file.

### Maintenance Mode

If you are doing major updates to the major update when the site needs to be down you can use WordPress's maintenance mode using WP-CLI.

`wp maintenance-mode activate|deactivate|status|is-active`

When activated this places a `.maintenance` file in the root directory, and will display a maintenance message for all WordPress pages.

Probably a better alternative is to only display the maintenance message to everyone but you, so you can go into the WordPress admin pages, test the site etc. without anyone else seeing. To do this create `maintenance.html` in the WordPress root with something like:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Maintenance Mode</title>
</head>
<body>
<h1>Maintenance Mode</h1>
<p>The site is currently undergoing essential maintenance. Please be patient, and check back later.</p>
</div>
</html>
```

And then make sure everyone but you sees it by adding the following to the root `.htaccess` file after the `RewriteBase /` line.

```apache
ErrorDocument 503 /maintenance.html
RewriteCond %{REQUEST_URI} !=/maintenance.html
RewriteCond %{REMOTE_ADDR} !=<your ip address>
RewriteRule ^.*$ - [R=503,L]
```

Don't forget to revert `.htaccess` after you complete you update, there should be a copy in `~/wordpress-config/.htaccess` if needed.

## VSCode

### .vscode directory

`.vscode\launch.json` has launch configs for PHP etc. If this repo and the main `www` repo are both open in the same VSCode Workspace then these configs can be used to debug code in `www`.

### Shortcuts

Markdown (.md) files (like this one)

* Preview - `Ctrl+Shift+V` in the editor
* Preview side-by-side `Ctrl+K V`

## Debugging WordPress Blocks

To see the state of your blocks you can use the console in the browser on the edit screen. For example, select the block in the editor and:

```js
wp.data.select( 'core/block-editor' ).getSelectedBlock()
```

Or add `.attributes` to the end for just the attributes.

The block ID can be found by in the blocks's markup in outermost div, something like 'block-b76e9375-e161-4945-884b-26f1a5dd268f'. Alternatively select the block and `wp.data.select( 'core/block-editor' ).getSelectedBlockClientId()`.

You can then do things like `wp.data.select( 'core/block-editor' ).getBlockAttributes( 'b76e9375-e161-4945-884b-26f1a5dd268f' )`.

## Testing JSON

The Firefox browser will automatically format anything received with the JSON content type, plus it has other useful stuff like displaying the response header.

Chrome has the JSON Viewer extension from <https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh>

## WPScan

[WPScan](https://wpscan.org/) is a WordPress security scanner. You will need to have [Ruby](https://www.ruby-lang.org/en/downloads/) installed, and then install with `gem install wpscan`.

You can get a free API token from <https://wpscan.com/>.

* `wpscan -h` - show help text
* `wpscan --update` - update the local database of vulnerabilities
* `wpscan --url https://dev.southlacrosse.org.uk/` - basic scan
* `wpscan --url https://dev.southlacrosse.org.uk/ -e vp --api-token YOUR_TOKEN` - vulnerable plugins
* `wpscan --url https://dev.southlacrosse.org.uk/ -e u` - user enumeration to determine what usernames are discoverable from the outside
* `wpscan --url https://dev.southlacrosse.org.uk/ -passwords file/path/passwords.txt` - brute force password testing. Search Google for lists of the most commonly used passwords. Bear in mind this will take a while if the list is long, and make sure you only run this on a local version of the site.

If you get errors like 'SSL peer certificate or SSH remote key was not OK' then you can run wpscan with the `--disable-tls-checks` option.

## Other Useful Tools

[Zed Attack Proxy](https://www.zaproxy.org/) is a web app scanner that can be used to test the vulnerability of the site.

[Validate Website](https://github.com/spk/validate-website) will test all pages of the website to check the validity of the HTML. You will need to have [Ruby](https://www.ruby-lang.org/en/downloads/) installed, and then install with `gem install validate-website`. You should run on a local version of the website, and grab [HTMLTidy](https://www.html-tidy.org/) which is a better validator than the bundled version. For Windows the simplest way to install HTMLTidy is to get the zip file, and extract the files in `bin` to somewhere on your path.

Run it with `validate-website -v -s https://dev.southlacrosse.org.uk/`

## Ruby

If you install Ruby for one of the above utilities, then you might find the following commands useful. `gem` is the name for Ruby packages.

* `gem update gem-name` - update a gem. You should run this on the gem you are using periodically to stay up to date.
* `gem query --local` - list installed gems

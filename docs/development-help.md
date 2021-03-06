# Development Help File

This file file contains useful info for development - probably mainly stuff I would forget if not written down! Kept out of the main README file as this is technical info which may be known by developers already - and in any case can be found with a bit of Googling.

## Git Commands

### Remote repos

* `git remote -v` - see what remote repos are linked
* `git remote add origin git@github.com:username/new_repo` - add remote repo (assumes connecting via SSH)
* `git remote set-url origin new.git.url` - change remote repository

### Branches

* `git checkout -b [name_of_your_new_branch]`
* `git push -u origin [name_of_your_new_branch]` - pushes and sets default upstream branch
* `git merge main` - merge current branch with another
* `git pull --prune` to tell git to discard all local pointers to remote branches which do not exist anymore
* To merge a branch into another, while squashing it to 1 commit

    ```console
    git checkout main
    git merge --squash bugfix-branch
    git commit
    ```

    Omitting the -m parameter on the commit lets you modify a draft commit message containing every message from your squashed commits before finalizing your commit.

## Commits

* `git add .` - add all files to index
* `git commit -am "message"` - Commit with a message. The `-a` flag (all) automatically stages files that have been modified and deleted, but new files you have not told Git about are not affected.
* `git reset --hard HEAD^` - delete the last commit. Be careful with this one!

### Stashing

* `git stash` stash the changes in a dirty working directory away, so you can do things like switch to another branch
* `git stash apply` restore the stashed changes
* `git stash list` see what's stashed
* `git stash drop <stash_id>` - delete a stash
* `stash drop clear` - delete all stashes

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
```

Which will enable you to enter:

* `git lol` - short for "log one line", will display a condensed log format
* `git tree` - show commit logs, including those on other branches, in a nice tree format

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

You will probably want to set up the SSH config file too, so that you can reference the server as `sl` rather than `user@southlacrosse.org.uk:123`. The config file is `%HOME%\.ssh\config` on Windows, and `~/.ssh/config` on other systems. And you should make sure it's only readable by the current user.

A suggested entry would be:

```text
Host sl
  HostName southlacrosse.org.uk
  Port <port>
  User <user>
  IdentityFile ~/.ssh/your_ed25519_private_key (~/ also works on Windows)
  IdentitiesOnly yes
```

## Multiple GitHub Accounts

If you want to be able to push to 2 GitHub accounts from the same client, for example you already have a work account and want to develop under a personal account, there are 2 options.

The best solution is to have an SSH key for each account. There are plenty of articles on how to do this, [this one works](https://stackoverflow.com/questions/4220416/can-i-specify-multiple-users-for-myself-in-gitconfig) (though you need to scroll down a couple of answers). You should use the ed25519 type instead of the default rsa, so `ssh-keygen -t ed25519 ...`. On Windows you need to change the OpenSSH Authentication Agent service so that it starts automatically, and is running, and add the environment variable `GIT_SSH=C:\WINDOWS\System32\OpenSSH\ssh.exe`. When you connect to GitHub over SSH you may get "The authenticity of host 'github.com (140.82.121.4)' can't be established.", in which case you can [check the fingerprint here](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/githubs-ssh-key-fingerprints).

Alternatively you can just set the email for the current repo with `git config user.email 123456+user@users.noreply.github.com`, and then if your other account has a Personal Access Token and write access to the repo then pushing will use the 123456+user email address to link to the correct user.

## Debugging PHP Using Xdebug

Xdebug is enabled by default in [Local](localwp.md). To debug in [VSCode](vscode.md) click the Run and Debug icon, and pick Listen for Xdebug from the dropdown list (configured in `www-dev\.vscode\launch.json`). See the VSCode site for [more information about debugging](https://code.visualstudio.com/docs/editor/debugging).

To control your debugging session you can use a browser extension like [Xdebug helper for Chrome](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc), [Xdebug Helper for Firefox](https://addons.mozilla.org/en-GB/firefox/addon/xdebug-helper-for-firefox/), or [XDebugToggle for Safari](https://github.com/kampfq/SafariXDebugToggle).

Alternatively to start a debugging session you can go to <https://dev.southlacrosse.org.uk/?XDEBUG_SESSION_START=wordpress>, and stop debugging with <https://dev.southlacrosse.org.uk/?XDEBUG_SESSION_STOP>.

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

You can also copy from production to staging by replacing `. ~/public_copy` with `. ./sub/stg`

### Deleting Files

* ``rm `ls -t db-wp-*.sql.gz| awk 'NR>5'` ``- delete all but the most 5 recent matching files (just run the `ls` to see what would be deleted!)
* `find backups/ -maxdepth 1 -name "db-wp-*.sql.gz" -type f -mtime +30 -delete` - delete matching files older than 30 days (run without the `-delete` argument to test)

### Editing Files With sed

By default sed outputs to standard out. Include the `-i` flag after sed to modify the file itself (edit in-place).

* `sed '/PATTERN-1/,/PATTERN-2/d' input.txt` - delete lines between patterns, including those lines
* `sed '/PATTERN-1/,/PATTERN-2/{//!d}' input.txt` - this time excluding those lines
* `sed '/PATTERN-1/,$d' input.txt`- delete all the lines after a pattern
* `mysqldump ... | sed 's$VALUES ($VALUES\n($g' | sed 's$),($),\n($g' | gzip ...` - have output of mysql dump have all row inserts on separate lines. You can also see [a script to do this to all .sql files in a directory](../src2/sql/inserts-on-new-lines.sh). This is really useful if you want to compare SQL files.

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

## NPM Commands

* `npm i` - install local node modules as defined in config files package.json/package-lock.json
* `npm i <package_name> --save-dev` - install a package for development, and save to package.json
* `npm i <package_name> --save` - install a package, and save to package.json
* `npm i <package_name> -g` - install a package globally, i.e. it can be accessed from the command line, and is installed in a globally available node directory, and not `/node_modules`
* `npm i -g npm` - update the node package manager itself
* `npm outdated` - see what packages are out of date, can add `-g` option to see global packages
* `npm update <package_name>` - update a specific package, or all if `package_name` is empty. Won't install newer major versions, so 1.9.9 won't be updated to 2.0.0. To do that you need the next option.
* `npm i <package_name>@latest --save-dev` - install latest version of a specific package
* `npm install npm@latest -g` - Update the node package manager to latest

`package-lock.json` contains a list of all installed packages, their versions, and the versions of their dependencies. That way when someone else install the NPM packages they will get the exact same version. To update packages you normally do `npm update` as above.

To reinstall with the most recent update (will not install newer versions, so 1.9.9 won't be updated to 2.0.0) then delete `package-lock.json` and run `npm i`.

To reinstall to the absolutely latest version, delete `package-lock.json` and delete the `devDependencies` section from `package.json`, then run `npm i <packages> --save dev` for all the packages used, which as time of writing would be `npm i @wordpress/icons @wordpress/scripts autoprefixer cross-env inline-source-cli npm-run-all postcss  postcss-cli postcss-csso svgo uglify-js --save-dev`.

You can update node itself from the command line in Linux, but for Windows & Mac you need to download a new installer.

## WP-CLI Commands

The WordPress command line interface is a very useful tool. See [full list of commands](https://developer.wordpress.org/cli/commands/).

WP-CLI will also work remotely by specifying an SSH host with the `--ssh` option, e.g. if you have our server set up as a Host sl in your `~/.ssh/config` file then `wp plugin list --ssh=sl:~/public_html` will list plugins on the production website, or if not then `--ssh=user@southlacrosse.org.uk:65002~/public_html`. [See also the WPL-CLI guide](https://make.wordpress.org/cli/handbook/guides/running-commands-remotely/).

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

Don't forget to revert `.htaccess` after you complete you update, `git checkout -- .htaccess`.

## Rclone Commands

See [the Rclone docs](rclone.md#Commands)

## VSCode

### .vscode directory

`.vscode\launch.json` has launch configs for PHP etc. If this repo and the main `www` repo are both open in the same VSCode Workspace then these configs can be used to debug code in `www`.

### Shortcuts

Markdown (.md) files (like this one)

* Preview - `Ctrl+Shift+V` in the editor
* Preview side-by-side `Ctrl+K V`

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

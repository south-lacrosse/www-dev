# Developer Information

## Developer Setup

### Skill Requirements

* WordPress
* Git, our version control system. There are [plenty of tutorials](https://www.youtube.com/watch?v=USjZcfj8yxE) if you are not familiar with Git
* PHP, the programming language WordPress is built using
* HTML and CSS
* JavaScript and Node.js
* Apache HTTP Server
* SQL - MySQL or MariaDB
* Batch & shell scripts

### Required Software

* [Git](https://git-scm.com/) (unless you are only sending in patches, in which case you can download zips of the repositories). See also [sample on configuring Git](../src/git-setup.bat).
* [Local](localwp.md), or [some other setup](#software-for-developing-locally) to run a server locally.

You can use any code editor, but [VSCode](https://code.visualstudio.com/) is recommended. See [Setting Up VSCode](vscode.md) for help on configuring VSCode for this project.

### GitHub Account

All our code is stored on GitHub. If you are only going to be making small changes then you can just clone the central repositories or download a zip, and send in patches. If not then you'll need to create a [GitHub](https://github.com/) account. You should note that your email address will be stored with every commit you make, and would therefore be displayed to everyone on GitHub. You can [protect your email address](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-user-account/setting-your-commit-email-address) by using your `xxx@users.noreply.github.com` email for any commits you do.

* [GitHub Desktop](https://desktop.github.com/) is a useful GUI tool to interact with Git and GitHub, with possibly the best part being that it uses the same diff implementation as the online GitHub, which makes it really easy to see what's changed.

## Development Cycle

Before detailing how to run and develop our WordPress site locally, it's worth understanding the development cycle using Git.

We use what is referred to as the [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow), or what GitHub calls the [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow).

All development always starts from the `main`, or live, branch. You then create a feature branch named something descriptive, e.g. `add-clubs-map`, and do all your development on that branch. When the feature is completed you create a pull request (or submit a patch) to submit the feature for review.

The SEMLA Administrator can then test the new feature branch on their machine. If that works then the feature branch is then deployed to the live server. If the branch causes a problem then the live server can be rolled back to the `main` branch, but if it works then the feature branch is merged back into `main`, and you can start all over again.

If you don't have write access to the central GitHub repositories then you have 3 options:

1. Ask for access, though if you are not known then you might be refused.
1. Clone the central repositories and only send in patches. This is very suitable for small changes.
1. Use the Fork and Pull model, which is basically
    * [Create a personal fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of the repository you want to contribute to
    * Edit the fork to make the changes you want to contribute
    * Create a pull request from the fork to propose your changes to the repository owner for merging

### Cloning the Repositories

When cloning the repositories to your local machine you should put `www-dev` somewhere sensible, but `www` can be cloned to a temporary directory as it should be merged with your WordPress directory (see [Configuring Local Development](#configuring-local-development)). If you have write access to the repository then you should clone using SSH from `git@github.com:south-lacrosse/repo` rather than `https://github.com/south-lacrosse/repo`, and if you have created a fork then do the same except replace south-lacrosse with your username.

```console
git clone https://github.com/south-lacrosse/www
git clone https://github.com/south-lacrosse/www-dev
```

### Creating Your Feature

1. Either
    * If you don't have the repositories already then clone them from GitHub
    * Or make sure your repository is on the `main` branch, and up to date

        ```console
        git checkout main
        git pull
        ```

1. Create a branch for the feature you are working on `git checkout -b descriptive-branch-name`
1. If you want to push your changes to GitHub then you will need to `git push --set-upstream origin branch-name` for the first push
1. Once the feature is complete then you should check to see if the `main` branch has changed, so do a `git pull`, and then `git merge main`. If there are any changes then test, and repeat this step.
1. Either
    * Make sure you have run `git push` to send your changes to GitHub, and then go to GitHub and create a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
    * or create a patch `git diff main > ..\feature.patch` and email that in

The SEMLA Admin should then:

1. Either
    * Copy the branch to their local machine

        ```console
        git fetch
        git checkout feature-branch
        ```

    * Or if they receive a patch then create a new branch locally, and `git apply feature.patch`
1. Test locally
1. If that works, the log into the live server and repeat step 1 there
1. Test on the live server
1. If there is a problem then revert to the `main` branch with `git checkout main`, work on the problem locally, and repeat
1. Once the feature is working merge the branch back into `main`. When merging you should squash your commits into one to keep the repository clean and concise.
    * You can do this when you merge using the GitHub interface. In the Pull Request (create one for the branch if there isn't one) make sure the green button to complete the merge says "Squash and merge" rather than the default "Merge pull request", and then merge. You should also select the option to delete the branch after the merge.
    * Using the Git client with `git merge --squash branch-name` and then `git commit`
    * Using the Git client with `git rebase -i` to have [fine grained control or which commits to squash](https://www.internalpointers.com/post/squash-commits-into-one-git)
1. Once you have merged you can safely delete the feature branch both locally `git branch -d branch-name` and on GitHub if needed
1. On the live server switch back to the main branch `git checkout main`, and delete the branch `git branch -d branch-name`

## Software For Developing Locally

See also [optional software](#optional-software).

By far the easiest way to develop locally is using Local, see [how to install and configure Local](localwp.md).

There are also alternative local development environments, including [DevKinsta](https://kinsta.com/devkinsta/) (Docker based), and [wp-env from WordPress](https://www.npmjs.com/package/@wordpress/env) (requires Docker). If you use one of these then you will need to adapt the Local instructions to configure your particular setup.

Another option is to install WordPress and all its dependencies: PHP, Apache HTTP Server & MySQL/MariaDB. You can install all the software individually, or use [WampServer](http://www.wampserver.com/en/) or [XAMPP](https://www.apachefriends.org/index.html). You'll need to figure out how to configure that yourself, though useful notes are:

* Download WordPress from <https://wordpress.org/download/> - the US version if fine, otherwise it will do a lot of translations.
* You should install [WP-CLI](https://wp-cli.org/), which is a command line tool to manage WordPress. It can install plugins and themes, among many other things.
* You will find useful configuration files, scripts to create SSH keys etc., in [the config directory](../config/README.md)
* Set the domain to `dev.southlacrosse.org.uk`, and add that to your `hosts` file.
* You should configure HTTPS, otherwise if you receive a copy of the production database you will need to do a search/replace to switch `https://dev.southlacrosse.org.uk` to `http:` (you should use the WP-CLI `search-replace` command as that will take into account serialized versions).

## Configuring Local Development

You should already have [cloned the repositories](#cloning-the-repositories), and have a WordPress site installed and configured, either using one of the local development environments, or by installing everything yourself. At a minimum it should have the web server set up and receiving requests to `https://dev.southlacrosse.org.uk`, the database created, and `wp-config.php` configured with authentication keys and database credentials.

When these instructions mention a "shell" they mean to open up a shell (e.g. command prompt on Windows, or a `bash` shell) and go to your `www` directory (unless specified). If you are using Local you can go to your site and click "Open site shell", which will configure all environment variables and paths, and take you to the root WordPress directory.

1. First you need to move your `www` repo into the directory where WordPress is installed and served by your web server (the WordPress root) e.g. in Local it will be `{site folder}\app\public`. Move the entire contents (including the `.git` directory) from your clone of `www` , overwriting `\.htaccess`. You can then delete the empty `www` directory.

    The WordPress root will now house WordPress along with your version of the `www` repo, and these documents will still refer to it as `www`. None of the WordPress files or other plugins & themes will be added to the `www` repository as they marked as untracked in `www\.gitignore`. You can `git checkout/branch/pull/push` from this directory as it's a normal repository.
1. Update the WordPress config file `www\wp-config.php` using `www\wp-config-semla.php` as a template
    * Copy and replace the `DB_CHARSET` and `DB_COLLATE` lines
    * Copy and replace everything from `$table_prefix = 'wp_';` down, and remove anything between "Live Server" and "End Live Server" (that's the live server config, we don't need that here)
1. If the site is running you will have to restart it for the changes take effect.
1. Add any required plugins. At a minimum you should install Envira Gallery Lite. Note that you don't need to activate them if you are going to replace the WordPress database from the production version, as it has these plugins activated. You can install them by either:
    * In your shell

        ```console
        wp plugin install envira-gallery-lite limit-login-attempts-reloaded
        ```

    * Go to your site's Add Plugins admin screen `https://dev.southlacrosse.org.uk/wp-admin/plugin-install.php` and install them manually

    See also [other useful plugins for development](development-plugins.md).
1. Get a copy of the Production database. The Webmaster should create this using `bin/create-dev-db.sh`, which will take a backup of the current database with user emails replaced with user{number}@southlacrosse.org.uk, and all the passwords set to 'pass'.
1. Import the production database

    Run `bin/run-sql.sh path/to/backup.sql.gz` (assumes the site/MySQL is running). If running in Windows you can run this using a Git Bash shell, or if you have cygwin or WSL then just run `bash` to get a Bash shell.

    Alternatively:
    * In Local
        * Go to your site's Database tab, and Open Adminer
        * Click Import on the left side of the screen.
        * Click Choose Files within the File Upload box.
        * Select the .sql.gz file(s) you were given and click Execute.
    * Otherwise your setup should have something like phyMyAdmin, so you can drop the backup there
1. You should now be able to log in as any user. The administrator will be email 'user1@southlacrosse.org.uk' password 'pass'.
1. Media files (images etc.) are stored in their own private repository. To get local copies you have a few choices:
    * If you have access to the `media` repository you can clone that by running `git clone git@github.com:south-lacrosse/media.git` from the `www` directory
    * Install the [BE Media from Production plugin](https://wordpress.org/plugins/be-media-from-production/) with `wp plugin install be-media-from-production` which will use media from the production site if it doesn't exist on the local machine. Make sure you add `define('BE_MEDIA_FROM_PRODUCTION_URL', 'https://www.southlacrosse.org.uk');` to your `wp-config.php` file.
    * You can download the directory with ftp/rsync/scp if you have access
1. New installations of WordPress may contain extra themes and plugins. You may safely delete those, or just leave them.
1. If you want to run SQL from the command line then you can copy over `mysql-dev.bat` or `mysql-dev` from [bin-local](../bin-local/) into your path, and modify the script to fit your environment. You can then run `mysql-dev [sql-file]` instead of `...\bin\run-sql.sh` (omitting the sql-file will open up the MySQL client).

You should now be all set up and `https://dev.southlacrosse.org.uk/` will take you to the site.

**And remember** before you start developing make sure you create a Git branch to work in!

## Optional Software

Depending on what you are developing, you may also need to install some, or all, of the following:

### Node

If you are going to be building the Gutenberg blocks, or minifying JavaScript or CSS, then you need to install [Node.js](https://nodejs.org/) and it's package manager `npm` which are used to automate the build. See also [npm commands in Development Help](development-help.md#npm-commands).

* Local copies of the node modules are stored in `www-dev\node_modules`, which is omitted from the Git repository as it is huge, so to install them you need to run `npm install` from the `www-dev` directory.
* Create a new file `www-dev\.npmrc` and add a line to point to the location of your public `www` directory, e.g. `www=C:/Users/{user}/localwp/south-lacrosse/app/public`

The config file `package.json` lists all locally installed packages, scripts etc. It has a sister file `package-lock.json` which list the exact version of all npm packages along with all their dependences, that way when you install you will get a setup which is known to work.

### Unix Like Tools

Some batch files and utilities use Unix command line tools like `gzip`. If you don't have these on your Windows system then to run these you can use the Git Bash shell. If you're using Local you can run the shell with the path and environment variables correctly set to run PHP and MySQL, in Preferences under Default Apps change the Terminal to Git Bash. Then go to your site and select "Open site shell".

Alternatively, to have Unix commands available everywhere you can either:

* Install [Cygwin](https://www.cygwin.com/) - this can additionally install a whole load of Unix command line utilities.
* Use the Windows Subsystem for Linux (WSL).

If you are going to run any of the `.pl` programs you will need to install a version of Perl.

## JavaScript and CSS Testing and Minification

Note: before running any `npm` commands make sure you have [installed and configured Node.js](#node).

See the [Custom Gutenberg Blocks](../src/blocks/README.md) for details on how to test and generate our WordPress blocks.

When testing any other JavaScript or CSS you can set SEMLA_MIN to '' in `wp-config.php` so that unminified versions are served so that it's easier to debug.

You will also probably find a tool like BrowserSync useful. It will automatically reload your page when any changes to the source (.js, .css, or .php) are made, and in many cases it can hot reload so only the changes are loaded, making development much easier.

To install BrowserSync globally run `npm install -g browser-sync`. Copy the [example config file](../config/bs-config.js) to your `www` directory, and change the settings under `https` to point to the certificates generated for you by Local (instructions are in the file). Then run BrowserSync from your `www` directory using `browser-sync start -c bs-config.js`.

If BrowserSync hangs then a possible cause is the URL resolving to ::1 (IPV6 loopback port). To fix that go to your `hosts` file and make sure it's set to 127.0.1.1, e.g. Local creates:

```text
::1 dev.southlacrosse.org.uk #Local Site
127.0.0.1 dev.southlacrosse.org.uk #Local Site
```

so comment out the first line (i.e. start it with #).

All the scripts for minification and building JavaScript, CSS, blocks etc. are in `package.json`. You can run them using `npm run script-name`.

 Hopefully most are pretty self-explanatory, but the main scripts are:

* `build` - create the production build of the blocks, and minify all JavaScript and CSS
* See the [blocks readme](../src/blocks/README.md) for block related tasks
* `build:wp` - minify the plugin and theme JS and CSS
* `js:<script>` - minifies a plugin or theme javascript file, e.g. `js:cal`
* `css:<plugin|theme>` - minify all the plugin or theme CSS
* `lint` - check all code styles

You must have a `.npmrc` file in the root of this project to point to the location of your `www` directory, e.g. `www=C:/Users/{user}/localwp/south-lacrosse/app/public`.

When you have finished developing make sure you `npm run build` (or just the specific script). You can then commit those changes in the `www` repo.

Note: If you are working on JS in the plugin or theme using VSCode, then in order for the `eslint` plugin to work you need to install `eslint` globally since VSCode looks for it in the current workspace folder (and we don't install any `npm` packages in `www`), then globally. To install globally `npm i -g eslint`.

## Images

### Icons

The Lax theme uses many SVGs (Scalable Vector Graphics) which were originally downloaded from [IcoMoon](https://icomoon.io/). SVGs can scale easily, and don't get pixelated, so are a good choice for icons.

The only problem with SVGs is that they aren't supported on really old browsers (IE8), so to allow access to the site for these users all icons which are absolutely required (home, search etc.) we have both a PNG and SVG. The PNG is served by default, and some JavaScript runs to determine if the browser supports SVG, and if it does it adds `svg` to the class on the `<html>` element so that SVGs can be served instead.

To create a PNG from the SVG use [Inkscape](https://inkscape.org/en/). You can set the stroke colour in `Object->Fill and Stroke...` to anything you want, then `File->Export PNG Image..`.

### Favicons

Generating all the Favicons if the logo changed can be a pain. A useful tool to generate all sizes is <https://realfavicongenerator.net/>.

Alternatively using [ImageMagick](https://imagemagick.org/), use something like:

```console
magick convert favicon.png -define icon:auto-resize=48,32,16 favicon.ico
```

Depending on the favicon you could also try `-colors 256` on the final convert.

### Screenshots (Windows only)

The simplest way to get screenshots for the [Help Sceeens](https://github.com/south-lacrosse/wp-help) on Windows is to use the built-in `Snip & Sketch` tool (`Windows Key+Shift+S`), which can save images as PNGs.

If you want to include the cursor in your image the best way is to use [IrfanView](https://www.irfanview.com/). Go to `Options->Capture/Screenshot...`, and select `Include mouse cursor`. Then `Ctrl+F11` takes a screenshot.

And don't forget to *compress* them. For that see below, or you can also install the IrfanView plugins as those include one to compress files with OptiPNG, which you can select on `File->Save as...`.

### Compression

Images should be compressed before being uploaded. Useful tools are:

* .jpg - compress with [MozJPEG](https://github.com/mozilla/mozjpeg/releases) or [ImageMagick](https://imagemagick.org/). [Gimp](https://www.gimp.org/) is an excellent free editing tool
* .png - [OptiPNG](http://optipng.sourceforge.net/) usage `optipng -o7 -strip all chevron-down.png` - and it will take wildcards
* .svg - `npm run svgo` will compress all SVGs in `www\wp-content\themes\lax\img`. You can also manually edit the xml in the `.svg` files.

You can also use `src\optimize_images.pl` to run MozJPEG and OptiPNG on a directory.

## Other Files

In the root directory of the `www` repository there are various files to conform to best practices.

If you don't understand these then look at something like [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate).

## .htaccess files

These files handle Apache configuration, and there are several in the `www` repository.

`www\.htaccess` has:

* WordPress settings
* Blocks many WordPress functions which we don't use, or could cause security issues
    * Comment URLs are blocked (this assumes we don't want to enable comments!)
    * Trying to access WordPress files results in 403s instead of blank pages
    * Blocks xmlrpc
* Makes sure browsers cache files as long as possible
* Redirects from old URLs to new
* Enforce https, and make sure the www URL is used
* etc.

### HTTP Headers

HTTP headers for things like X-Frame-Options are set in the root `.htaccess` file, however some headers set in `.htaccess` will be ignored in PHP files, depending on how they are run, so must be added in the PHP code.

See [what to do when changing production server](setting-up-server.md#http-headers)

Not sure if we want HSTS, but if we do then leave at least few months after the https site is running, otherwise redirects won't be effective (our redirects are from http:, so http: /fixtures.html gets redirected to https: /fixtures, but if HSTS is set then the browser will force http: to https:, so the removal of .html won't work).

```apache
# 300=5 minutes, 604800=1 week, 2592000=1 month, 63072000=2 years. Do each in turn and check it works
Header always set Strict-Transport-Security "max-age=604800; includeSubDomains"
```

## Testing Cacheing

To test locally you can drop our test plugin `src\plugins\lscache-test.php` into `wp-content\plugins` and activate it (or put it in `wp-content\mu-plugins`). It will log calls to litespeed actions to the debug log, which is usually `wp-content\debug.log`.

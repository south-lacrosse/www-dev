# Local

[Local](https://localwp.com/) is a development tool that allows you to set up WordPress on your local machine with a few clicks. It installs and configures WordPress with all its dependencies, and will even set up SSL.

Note: these instructions are correct for the version of Local at the time of writing. You may need to adjust them to fit your particular version.

Local stores files in various places, but the most important one to know is how it stores the website.

```txt
{sites path}          e.g. C:\Users\{user}\localwp
├── {site folder}     e.g. south-lacrosse
│   ├── app
│   │   ├── public    website source (or www), including WordPress
│   │   └── sql
│   ├── conf
│   │   ├── apache
│   │   ├── mariadb or mysql
│   │   └── php
│   └── logs
├── {another site folder}
└── ...
```

## Creating The South Lacrosse Site In Local

Note: Before creating your site you should take a glance at [Custom Database Versions](#custom-database-versions).

Once Local is installed you should create a site for the South Lacrosse website. At various steps on this process you may be asked "Do you want to allow this app to make changes to your device?", to which you should say Yes.

1. Run Local
1. You can set defaults in Menu->Preferences. Under "New site defaults" you can set the site path (the parent directory where Local stores your sites' files, though on Windows it won't let you store them outside of your `%HOME%` directory `C:\Users\your-username`). The default sites path ends `Local Sites`, so you might want to change that to `localwp` in order to keep spaces out of the file name, as that can cause problems with some tools.
1. Add a new site (the + button in the bottom left), then "Create a new site".
    * On step 1 set the name to something like `South Lacrosse`, and pull down Advanced Options and set the domain to `dev.southlacrosse.org.uk`.
    * On step 2 select Custom, and set the Web Server to Apache (note you must be connected to the internet as the Local installation doesn't include Apache, and it will need to download it). You will need to choose from MySQL and MariaDB for the database, so pick whichever our current hosts are using (at time of writing MariaDB), and choose the latest installed version of that and PHP.
    * On step 3 set your administrator username and password to admin/admin, and leave the email. These will all be replaced later anyway.
    * It will then take a couple of minutes to install, probably asking for firewall permissions on the way (you should allow private networks not public). Once your site is started you should see its details.
1. Under `SSL` click `Trust` to add the certificate to the current user's trusted list. That will stop your browser complaining that the site is insecure when you access it via HTTPS. You will need to restart your browser for this to take effect.
1. Note: just under the site name you will see a link for "Go to site folder" which you will need in the next steps.
1. Local doesn't enable some common Apache modules by default. At a minimum you should enable `mod_headers`, and `mod_expires`. Edit file `{site folder}\conf\apache\modules.modules.conf.hbs` and add the following lines:

    ```apache
    LoadModule headers_module "{{ modules }}/mod_headers.so"
    LoadModule expires_module "{{ modules }}/mod_expires.so"
    ```

1. Local also doesn't load `mod_deflate`, which is used in production to automatically compress all server output. For local development it isn't worth compressing/decompressing each request, but you can add it as above if you are testing that functionality.
1. You should change Local's PHP configuration, which is at `{site folder}\conf\php\php.ini.hbs`, as below.
    * Change `short_open_tag = On` to `Off` as hosts usually have this off. With this option Off short tags (`<?` instead of `<?php`) cause an error, so it's important that the local environment matches production in order to catch errors early on.
    * You should be using PHP8+, which uses Xdebug 3. Xdebug does add some additional overhead, so this can be toggled within Local for each site, however that requires the site's web server to restart for each change.

        Local usually always loads the Xdebug extension, and just disables/enables it. You might want to change it so that the extension is only loaded when Xdbeug is enabled.

        Local has `xdebug.start_with_request=yes`, so when Xdebug is enabled it will try and connect to the debugging session on every request, which will result in a 200ms delay if you don't have a debugger listening.

        You can also set `xdebug.start_with_request=trigger` so that Xdebug will only connect to the debugging session when a specific environment variable or cookie is set, and therefore minimizes the performance impact when you are not actively debugging (don't forget to disable Xdebug when you are completely finished debugging though). You can then install a [browser extension to control this](https://xdebug.org/docs/step_debug#browser-extensions), and we provide `\bin-local\wpd.bat` to run WP-CLI in debug mode.

        Also note that running with Xdebug even when not actively debugging means the [Xdebug Development Helpers](https://xdebug.org/docs/develop) are always enabled, such as enhanced `var_dump()` and stack traces on errors.
    * For some strange reason OPcache is disabled for Apache. You can enable this to speed up the server. The code was:

        ```ini
        {{#unless apache}}
        [opcache]
        {{#if os.windows}}
        zend_extension = php_opcache.dll
        {{else}}
        zend_extension = {{extensionsDir}}/opcache.so
        {{/if}}

        opcache.enable=1
        opcache.enable_cli=1
        {{/unless}}
        ```

        You can remove both the `unless` lines to re-enable (or comment them out with `{{!#unless apache}}` and `{{!/unless}}`). You should also set `opcache.enable_cli=0`, which stops errors in WP-CLI (and shouldn't be enabled anyway).

        Note: for later versions of PHP OPcache is a required extension that is built into every binary, so you won't see the `zend_extension` lines.
1. If you want to use WP-CLI from a `bash` shell on Windows you then you may encounter an error "'C:\Program' is not recognized as an internal or external command, operable program or batch file." when you run the `wp` command.

    This is probably because the `wp` file has Windows line endings, so you need to convert the file to Unix format with LF line endings. The file should be `C:\Program Files (x86)\Local\resources\extraResources\bin\wp-cli\win32\wp`, but if not you can find it with `which wp`. You will need Administrator rights to change it if the file is in `Program Files (x86)`.

    There are many ways to convert to Unix format. You can do that with the utility `dos2unix` if you have it, or VSCode and Notepad++ have an option to change the end of line sequence, so you can save from there.
1. Next we need to clone the repositories. Make sure you clone to the `{sites path}` directory. It doesn't actually matter for the `www` repo as that will be moved later, but `www-dev` must be located there for the [VSCode setup](vscode.md).

    See [instructions on how to clone the repositories](developer-info.md#cloning-the-repositories).
1. You should then [follow the rest of the instructions](developer-info.md#configuring-local-development) in Developer Information to complete setting up the site.

## Using Local

You can check the running PHP configuration by clicking on "Details" next to the PHP version (available if the site is running) to open the PHP Info page for the site.

It should be noted that Local won't add MySQL or PHP to your system path, however the Site shell (available from the site's page in Local) will have the correct paths and environment variables set. You can then use this shell to run MySQL or PHP, or any commands which need them e.g. running WP-CLI.

You should also find the Site shell script so you can call it from any shell or from your own scripts. To do that, first determine the site's slug; from the Site shell enter `echo %MYSQL_HOME%` (Windows) or `echo $MYSQL_HOME`, and the slug will be the directory before `conf`, e.g, for `C:\Users\{user}\AppData\Roaming\Local\run\VVWcvJ3UU\conf\mysql` it will be `VVWcvJ3UU`. Alternatively look under `Loaded Configuration File` on the PHP Info page.

 The scripts will be `{site slug}.bat` and `{site slug}.sh` in the Local `ssh-entry` directory, which you can find by selecting `Reveal Local's log` from the menu in Local (in Windows it will be `C:\Users\{user}\AppData\Roaming\Local\ssh-entry\`). Note: these scripts are only created the first time you run the Site shell.

Local can automatically log you in to WordPress by going to your site and enabling `One-click admin`. You can then click on `WP Admin` to go straight to the Dashboard without having to log in. You can also add a bookmark to the same URL: `https://dev.southlacrosse.org.uk/wp-admin/?localwp_auto_login=1`.

Local will intercept any emails sent by WordPress. To see them go to your site in Local, and under Utilities
you will find Mailpit (or Mailhog for versions < 9).

## Possible Issues

If you have `WP_DEBUG` set to true you may notice `Warning:  mysqli_real_connect(): (HY000/2002)...` errors popping up in the error log, which is because Local sometimes runs WP-CLI before the database is running. To stop this you can disable `WP_DEBUG` for CLI in your `www/wp-config.php` file:

```php
if (defined( 'WP_CLI' ) && WP_CLI) {
    define('WP_DEBUG', false);
} else {
    define('WP_DEBUG', true);
    define('WP_DEBUG_LOG', true);
}
```

Occasionally Local may leave nginx running on port 80 even after you exit Local. If you need to run another server using port 80 and it's blocked, then you will need to stop nginx in the task manager.

If you are using Xdebug and are finding the session times out quickly then you may need to increase the FastCGI timeout in `{site folder}\conf\apache\site.conf.hbs`. After `<IfModule fcgid_module>` add a line `FcgidIOTimeout 600`, and restart the site.

## Local and VSCode

The best way to run [VSCode](vscode.md) is to make sure you run Local's Site shell script to set up correct paths and the environment, and then run VSCode. This is because Local doesn't add anything to your system path or settings, but VSCode needs those settings e.g. you need a PHP executable on your path (or added as a setting) so that it can validate your PHP code.

On Windows we provide a script to do this at `\bin-local\code-sl.bat`, though to use it this repo *must* be in `C:\Users\{user}\{sites path}\www-dev` as it uses relative paths and has minimal error checking. You will need to know the `{site slug}` (see above).

* Right-click on your desktop
* Select New->Shortcut
* Enter the location as `{full path to www-dev\bin-local\code-sl.bat} {site slug}` e.g. `C:\Users\{user}\localwp\www-dev\bin-local\code-sl.bat VVWcvJ3UU`. The path will need to be enclosed in quotes if it contains spaces.
* Hit Next
* Enter a sensible name, e.g. "SL Code" (best to keep it short, otherwise it will get truncated when displayed)
* Hit finish

You should then be able to double-click the shortcut to open VSCode with everything configured correctly.

If you cannot use our script then you will need to create your own batch file such as:

```bat
@echo off
call %APPDATA%\Local\ssh-entry\{site slug}.bat
code path\to\www-dev\south-lacrosse.code-workspace | exit
```

Those on other systems will hopefully be able to create their own scripts based on the above.

Alternatively, you can just open the Site shell from Local and run VSCode from there using something like `code ..\..\..\www-dev\south-lacrosse.code-workspace`.

## Imagick

You may find PHP isn't configured correctly for the Imagick extension (at least on Windows). To check this go to the PHP Info page, which you can get to by going to your site in Local, and next to the PHP version click on "Details" (the site must be running), and look for the Imagick section.

Local actually ships PHP with the Imagick extensions, it just fails to put the ImageMagick directory on the path. You can fix this by:

1. On the PHP Info page search for `extension_dir`, and the PHP directory will be this directory's parent (there should be `php.exe` in there)
1. Move everything in the `ImageMagick` subdirectory into the PHP directory
1. Uncomment the line `;extension = php_imagick.dll` (remove the `;`) in the PHP configuration, which is at `{site folder}\conf\php\php.ini.hbs`
1. Restart the site
1. Reload the PHP Info page, and check for the Imagick module section

## Custom Database Versions

Local only comes with a limited number of versions of MySQL and MariaDB. It is generally preferable to have the database match that used on the production site, so if your preferred version is not available then see [How to create a custom DB service](../src/local-db-service/README.md).

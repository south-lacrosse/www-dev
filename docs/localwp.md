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
│   │   ├── mysql
│   │   └── php
│   └── logs
├── {another site folder}
└── ...
```

## Creating The South Lacrosse Site In Local

Once Local is installed you should create a site for the South Lacrosse website. At various steps on this process you may be asked "Do you want to allow this app to make changes to your device?", to which you should say Yes.

1. Run Local
1. You can set defaults in Menu->Preferences. Under "New site defaults" you can set the site path (the parent directory where Local stores your sites' files, though on Windows it won't let you store them outside `C:\Users\your-username`). The default sites path ends `Local Sites`, so you might want to change that to `localwp` in order to keep spaces out of the file name, as that can cause problems with some tools.
1. Add a new site (the + button in the bottom left), then "Create a new site".
    * On step 1 set the name to something like `South Lacrosse`, and pull down Advanced Options and set the domain to `dev.southlacrosse.org.uk`.
    * On step 2 select Custom, and set the Web Server to Apache (note you must be connected to the internet as the Local installation doesn't include Apache, and it will need to download it). Choose the latest installed versions of PHP and MySQL.
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
1. You should change Local's PHP configuration to fix their Xdebug settings and enable OPcache, so edit `{site folder}\conf\php\php.ini.hbs`.
    * You should be using PHP8+, which uses Xdebug 3. Local has `xdebug.start_with_request=yes`, so when Xdebug is enabled it will try and connect to the debugging session on every request, which will result in a 200ms delay if you don't have a debugger listening.

        You could leave this as is, and just use the toggle within Local to turn Xdebug off and on for the site, but that requires the server to restart for each change.

        However, we think it's much better to leave Xdebug enabled all the time, but set `xdebug.start_with_request=trigger` so that Xdebug will only connect to the debugging session when a specific environment variable or cookie is set. You can then install a [browser extension to control this](https://xdebug.org/docs/step_debug#browser-extensions), and we provide `\bin-local\wpd.bat` to run WP-CLI in debug mode. This will ensure the [Xdebug Development Helpers](https://xdebug.org/docs/develop) are always enabled, such as enhanced `var_dump()`.
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

        You can remove both the `unless` lines to re-enable (or comment them out e.g. `{{!#unless apache}}`). You should also set `opcache.enable_cli=0`, which stops errors in WP-CLI (and shouldn't be enabled anyway).
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

Local can automatically log you in to WordPress by going to your site and enabling `One-click admin`. You can then click on `WP Admin` to go straight to the Dashboard without having to log in. You can also add a bookmark to do the same think: `http://dev.southlacrosse.org.uk/wp-admin/?localwp_auto_login=1`.

Local will intercept any emails sent by WordPress. To see them go to your site, and under Utilities
you will find Mailhog.

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
call C:\Users\{user}\AppData\Roaming\Local\ssh-entry\{site slug}.bat
code path\to\www-dev\south-lacrosse.code-workspace | exit
```

Those on other systems will hopefully be able to create their own scripts based on the above.

Alternatively, you can just open the Site shell from Local and run VSCode from there using something like `code ..\..\..\www-dev\south-lacrosse.code-workspace`.

## Imagick

Local doesn't come with the Imagick extension on some platforms, notably Windows. To add it on Windows:

1. First you need to determine the setup of your site. Go to your site in Local, and next to the PHP version click on "Details" (the site must be running) to get the PHP Info page. Make a note of:
    * Architecture (probably x64)
    * Thread Safety (probably disabled)
    * PHP version
    * extension_dir - the PHP directory will be this directory's parent (there should be `php.exe` in there)
1. Go to <http://pecl.php.net/package/imagick>
1. Pick the version of the extension you want, usually the latest version, and click on DLL
1. Pick the download compatible with your site e.g. "8.1 Non Thread Safe (NTS) x64"
1. Extract the zip file
1. For the next 2 steps you will need Administrator privileges
1. Move `php_imagick.dll` to the `extension_dir`
1. Move all other dlls into the PHP directory
1. Edit `{site folder}\conf\php\php.ini.hbs` and add

    ```ini
    {{#if os.windows}}
    [imagick]
    extension = php_imagick.dll
    {{/if}}
    ```

1. Restart the site
1. Reload the PHP Info page, and check for the imagick module section

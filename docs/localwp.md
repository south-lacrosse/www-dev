# Local

[Local](https://localwp.com/) is a WordPress development tool that allows you to set up WordPress on your local machine with a few clicks. It installs and configures WordPress with all its dependencies, and will even set up SSL.

Once Local is installed you should create a site for the SEMLA website. At various steps on this process you will be asked "Do you want to allow this app to make changes to your device?", to which you should say Yes.

1. Clone the repositories as detailed in the [Developer Information](developer-info.md#cloning-the-repositories)
1. Run Local
1. You might want to set some defaults in Menu->Preferences, specifically you may want to set where Local stores your sites' files, though it won't let you store them outside `C:\Users\your-username` on Windows. You might want to change the folder from `Local Sites` to `localwp` in order to keep spaces out of the file name, which can cause problems.
1. Create a new site.
    * On step 1 set the name to something like `SouthLacrosse`, and pull down Advanced Options and set the domain to `dev.southlacrosse.org.uk`. You can set the domain to anything you want, but it should end in `.southlacrosse.org.uk` otherwise the Google maps functionality won't work. Also using the `dev` prefix keeps the URL the same length as `www.southlacrosse.org.uk`, which means you can do a simple search and replace to change the URL from `www.` to `dev.` in any SQL files, as otherwise any PHP serialized values might be corrupted. You can also set the folder to store the site if you don't like the default.
    * On step 2 select Custom, and set the Web Server to Apache. You can probably leave the PHP Version and Database as their defaults, though it is probably best to use the latest versions.
    * On step 3 set your administrator username and password, keep it simple so admin/admin is fine as it will be replaced later. You can leave the email as it will be replaced later.
    * It will then take a couple of minutes to install, probably asking for firewall permissions on the way. Once your site is started you should see its details.
1. Under `SSL` click `TRUST` to add the certificate to the current user's trusted list. That will stop your browser complaining that the site is insecure when you access it via HTTPS. You will need to restart your browser for this to take effect.
1. Local doesn't enable some common Apache modules by default. At a minimum you should enable `mod_headers`, but to match the production environment you should also enable `mod_expires` and `mod_deflate`. Edit file `{site dir}\conf\apache\modules.modules.conf.hbs` and add the following lines (you will need to restart the site for those changes to take effect):

    ```console
    LoadModule headers_module "{{ modules }}/mod_headers.so"
    LoadModule expires_module "{{ modules }}/mod_expires.so"
    LoadModule deflate_module "{{ modules }}/mod_deflate.so"
    ```

1. Move the entire contents (including the `.git` directory) from your clone of `www` to `{site dir}\app\public`, overwriting `\.htaccess`. You can then delete the empty `www` directory.
1. `{site dir}\app\public` will now house your version of the `www` repo, and this document will still refer to it as `www`. None of the WordPress files or other plugins & themes will be added to the `www` repository as they marked as untracked in the `www\.gitignore` file. You can `git checkout/branch/pull/push` from this directory as it's a normal repository.
1. Update the WordPress config file `{site dir}\app\public\wp-config.php` using `{site dir}\app\public\wp-config-semla.php`
    * Change the `DB_CHARSET` to match
    * Copy and replace everything from `$table_prefix = 'wp_';` down
1. You can then follow the rest of the instructions in the [main Readme](../README.md#configuring-local-development) to complete setting up the site

You will need to update the Local PHP configuration by changing `{site dir}\conf\php\php.ini.hbs`.

* If you see `xdebug.start_with_request=yes` change it to `xdebug.start_with_request=trigger`, otherwise you get a 200ms delay in every request unless you are debugging. Seems like this setting is for PHP8 only.
* Change `opcache.enable_cli=1` to `opcache.enable_cli=0`. This stops errors in WP-CLI.
* Add the following extensions if they are not there. WordPress site health tool complains about them if they are missing, so it's wise to add them.

    ```ini
    extension=php_fileinfo.dll
    extension=php_intl.dll
    ```

If the site is running you will have to restart it for the changes take effect.

## Using Local

It should be noted that Local won't add MySQL or PHP to your default path, however you can open up a terminal with the path and all other environment variables set by Local to run MySQL, PHP and WP-CLI, by right-clicking on your site and "Open Site Shell". There are also various other useful options when right-clicking.

If you will be using the VSCode editor and you are editing PHP code you will need a PHP executable on your path, or added as a setting.

Depending how you want to handle this, and the possibility that you may want to add MySQL to the path too, there are several options listed below. You can find all the settings you need in the scripts Local creates to run the Site Shell (you have to go into the Site Shell first, as Local only creates these files once needed), which on Windows are in `C:\Users\{user}\AppData\Roaming\Local\ssh-entry\` with file names like `3pp-cGOJY.bat` (and .sh), or you should be able to find it by selecting Reveal Local Router's Logs from the Local menu, and if you go up a couple of directories you should find the ssh-entry folder. If you have several Local sites then there will be many files here so make sure you select the right one.

* You can just add the setting `php.validate.executablePath` in VSCode to point to the Local PHP executable as per the file above (or you can check the path when you run the Site Shell). If you don't set this, and there's no PHP executable on the path, then VSCode will prompt you for it the first time you open a PHP file. If you want to run MySQL commands from the integrated terminal you can always run the batch file above to add all the MySQL settings.
* You can run VSCode from the Site Shell using `code .`
* On Windows you can create a shortcut to run the Local batch file and then VSCode e.g. `C:\Windows\System32\cmd.exe /c "C:\Users\user\AppData\Roaming\Local\ssh-entry\3pp-cGOJY.bat && start code C:\local\southlacrosse-repos\south-lacrosse.code-workspace"` - though this does leave a command window hanging around. This assumes you have created a workspace config file. If not then enter a directory to run VSCode in.

Local will intercept any emails sent by WordPress. To see them go to your site, and under Utilities you will find Mailhog.

Note: Occasionally Local may leave nginx running on port 80 even after you exit Local. If you need to run another server using port 80 and it's blocked, then you will need to stop nginx in the task manager.

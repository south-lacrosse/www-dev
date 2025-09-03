# Installing Other Versions Of MariaDB In Local

This is unsupported, and may not work with future versions of Local. It works on at least Local Versions 9.1.0 to 9.2.4 on Windows. This should work on MacOS and Linux too, but I don't have any way of testing it. Use at your own risk!

Note: if this fails to work in future releases [see below](#how-this-service-was-created) for how this service was created.

First decide what version of MariaDB you want to use. The example here uses version 10.11.10.

1. Go to `%APPDATA%\Local\lightning-services` (for MacOS and Linux you'll have to find this directory, so open a Site Shell from Local and then `echo $PATH`, or open PHP Details and search) and create a directory for the new service. I'm not sure if the format of the name is relevant, but I followed the pattern for existing services so I created `mariadb-10.11.10+0`.

    You will see all the other Local services here, so you might want to check out one of the database service folders to see what we're aiming for.

1. Copy the files in this folder into that directory, though you can skip this readme.
1. If the version of MariaDB you're using is not 10.11.10 then edit `package.json`, `lib\MariadbService.js`, and `lib\main.js` to replace the version number.
1. Copy over the node_modules directory from one of the other database services e.g. `Local\lightning-services\mariadb-10.4.32+1`, though make sure the dependencies match in both `package.json` files (you can ignore the dev-dependencies). Alternatively run `npm i` if you have node installed.
1. Go to <https://mariadb.org/mariadb/all-releases/> and download the version you want. On Windows make sure to select `Zip file` for the Package Type, and the Architecture is `x86_64`, as this code won't work for x86 (though x86 isn't
available for recent versions anyway).

    For Linux you can download a .tar.gz, but MacOS seems to be handled differently, so you'll need to figure this out yourself.

1. Inside your service's directory create a directory `bin\win64` for Windows, `bin/darwin` for Mac, or `bin/linux` for Linux, and then extract the MariaDB download into that.
1. Stop and restart Local.

You should now have the option to select your database service with your new version of MariaDB when you create a new Local site. If you have an existing site you want to upgrade then you'll have to export, delete, and import (or figure out a way to upgrade in-place yourself, it's definitely doable).

## How This Service Was Created

We took the `mariadb-10.4.32+1` service, changed version numbers, and combined that with how `mysql-8.0.35+2` handles paths and binaries to allow for the 64bit binaries.

## Upgrading MariaDB Version Of An Existing Service

Since you cannot change the database of an existing site in Local, the most error proof way to upgrade database version is to:

1. Create the new service as above
1. Export the site from Local
1. Delete the site
1. Import the site, making sure to select the new database service

Alternatively, for a service you created (don't modify the existing Local services as they might get overwritten) just leave the previous service in place and:

1. Stop the Local site
1. Download the new MariaDB zip as above
1. Delete the existing binary under the service's `bin` directory (subfolder will depend on your OS), and replace with the downloaded version
1. Start the site
1. Upgrade the database. If this is a minor upgrade then `mysql_upgrade` should work, otherwise follow the upgrade instructions in the release notes

Of course with this method Local will still show the database service as the previous version, but under the covers it will be running the new version, which you can check from WP Admin by going to `Tools->Site Health->Info->Database`.

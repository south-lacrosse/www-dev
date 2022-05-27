# Configuration

It is recommended that you run [Local by Flywheel](https://localwp.com/) for local WordPress development as it will configure the Apache web server, the database, WordPress, create certificates for you etc. However if you have an alternative setup (e.g. WAMP or XAMPP) this folder contains sample configuration files to run the SEMLA website on Windows.

You can also [create and install self-signed certificate in Windows](ssl), otherwise web browsers will complain that the certicate is not secure.

You will also need to add a host name for `dev.southlacrosse.org.uk` to point to your local machine - that way you can enter that address in your browser to access the development version of the site. In Windows the file is `C:\Windows\System32\drivers\etc\hosts` and on Linux it's `/etc/host`.

You need to add a line `127.0.0.1       dev.southlacrosse.org.uk`

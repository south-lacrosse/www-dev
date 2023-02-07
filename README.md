# SEMLA WordPress Project

This is the source for the South of England Men's Lacrosse Association website, which is run on WordPress.

Other useful documents are:

* [Design Notes](docs/design-notes.md) - basic outline of the design of the system
* [Developer Information](docs/developer-info.md) - how to set up a development environment, the development cycle, and useful tools and information
* [Development Help](docs/development-help.md) - useful notes on techie stuff like Git commands
* [Web Server](docs/web-server.md) - how our web server is set up, importing fixtures from the command line, staging environment etc.
* [Backups](docs/backups.md)
* [Recovering From a Backup](docs/recovery.md)
* [Webmaster Tasks](docs/webmaster-tasks.md)
* [Setting Up a New Production Server](docs/setting-up-server.md)
* [Fixtures Sheet Format](docs/fixtures-sheet-format.md)
* [Fixtures Sheet Instructions](docs/fixtures-sheet.md)

England Lacrosse are developing a fixtures application, so it is assumed we will move over to that before the end of the season. If that is not the case then check out [Information on Maintaining the Fixtures, Tables and History](docs/fixtures-tables-history.md). If the change does occur then additional code will have to be written to update the history tables from the EL app.

## Repository Setup

This repository holds the documentation, source code and build scripts for our custom WordPress editor blocks, scripts for minifying CSS & JavaScript, and various other sources, configuration files, and setup scripts.

The SEMLA WordPress theme and plugin are in the sister [www repository](https://github.com/south-lacrosse/www). It has its own repository as that can then be cloned to the root of the production server without pulling in all the development code, or having issues associated with the web root being a sub-directory in the repo.

Media files are in the `south-lacrosse/media` private repository.

Sensitive configuration files are stored in `south-lacrosse/wordpress-config`, which is again private, and must never be made public.

WordPress itself isn't kept in the repository as it can easily restored, and the same for the non-SEMLA plugins. This also means that WordPress core and plugins can be automatically updated on the live server, which will mean any security issues will be patched quickly.

# Design Notes

## WordPress

We chose to code the website in WordPress as it's used to power 25% of the internet (or so it is claimed), so there are plenty of resources to learn about it, and plenty of expertise to customise it.

In WordPress the application logic is mainly handled by `plugins`, and the look of the site is handled by `themes`, although there is a lot of overlap. The SEMLA site uses a custom plugin (Semla) and custom theme (Lax).

The Semla plugin does many things, including:

* Add a `clubs` post type to organise club pages
* Add a `history` post type to organise historical pages
* Add editor blocks for custom layouts including:
    * location maps using Google Maps
    * various data options, like clubs map, fixtures, or league tables
    * attribute/value pairs for things like contacts
* Importing fixtures and creating league tables
* Add WP-CLI commands to run various functions from the server command line, e.g importing fixtures
* Remove all commenting functionality
* Improve security

### Folder Structure

When the `www` repository and WordPress are combined the folders will look like (wp-* are WordPress folders):

```txt
├── bin (our useful server side executables)
│   └── backups
├── media (our wp-content/uploads) - held in a separate media Git repository
├── sub [1]
├── wp-admin
├── wp-content
│   ├── plugins
│   │   ├── semla (our custom plugin)
│   │   └── other plugins as added
│   ├── themes
│   │   ├── lax (our custom theme)
│   │   └── default WordPress theme [2]
│   └── uploads [3]
└── wp-includes
```

\[1\] `sub` is a directory for subdomains. At time of writing our website host forces subdomains to be installed in the parent domain's directory, so to keep things simple we have put all subdomains under this directory. This also allows us to easily deny access to this directory and it's sub-directories from the main website.

\[2\] There may be other themes as WordPress releases new default themes each year (which are named something like twentytwentytwo). Leave at least one theme as it serves as a backup in case of any problems in our custom theme, but the others should be deleted.

\[3\] WordPress may re-add this directory, but SEMLA uses /media, so uploads should be deleted.

We gave the `media` directory its own repository so that it can be automatically backed up from the server without having to give the server access to the main `www` repository. This repository can then also be pruned if the history gets too big, but it is assumed (at least in the short/medium term) that these files won't change or be deleted.

## Plugin Design

The SEMLA plugin is mainly based around PHP classes under the Semla namespace, and there is also a custom class autoloader. This has several advantages:

* It keeps everything out of the global namespace, so there will be no name clashes with other plugins
* We can repeat method names in different classes to allow more consistency
* With an autoloader we don't need to require files, we can just reference a class and the autoloader will require the source file if needed

The majority of classes only have static methods as there was no need to have multiple objects.

All classes can be found under the `core` directory. The top level classes are the main application, plus blocks. The sub-namespaces are as follows:

* Admin - admin menu items
* Data_Access - encapsulates all SQL database access, and access to remote data sources like our Google fixtures sheet. Classes mainly use the [Table Data Gateway pattern](https://www.martinfowler.com/eaaCatalog/tableDataGateway.html)
* Render - classes to render HTML, usually from data obtained from the data access gateways
* Rest - handle the REST interface for club/team fixtures/tables etc.
* Utils - utility classes

All class files will start with a capital letter, and match the class name, e.g. App_Public.php. There are a few other files which are not classes, and will have lowercase file names, and these are just included in other files when needed.

There are also several `views` directories, which are used to separate the view components from the rest of the source. These files are usually mostly HTML, with PHP variables inserted. They are then `required` whenever needed in the relevant classes.

## Custom Editor Blocks

Our custom Gutenberg editor blocks are found in the [src/blocks](../src/blocks/) directory. See the [readme file](../src/blocks/README.md) for details.

## Database Table Names

We use the prefix `sl` for South Lacrosse. The tables are split into 3 sub-categories:

* `slc_` - current season fixtures, can be recreated by importing fixtures
* `slh_` - historial data, e.g. all past league winners, only updated yearly
* `sl_` - anything else, like team name aliases

## Help Pages

Help pages are linked to from the admin menu bar, and are at <https://south-lacrosse.github.io/wp-help/>. The source for these pages is in markdown format (like this file), and are in the repository at <https://github.com/south-lacrosse/wp-help>.

When you change any source in the repository Github Pages automatically builds the website using Jekyll. You can chose different themes, and modify them to suit your website, but to keep things simple we chose the minima theme, which is set in `_config.yml`, with minimal modifications, so we only changed the header and footer, which can be found in `/_includes`.

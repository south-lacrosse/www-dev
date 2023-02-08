# Custom Gutenberg Blocks

See also [debugging WordPress blocks](../../docs/development-help.md#debugging-wordpress-blocks).

This is the source directory for our WordPress blocks. They are built using the WordPress provided `wp-scripts`, and compiled to the `plugin` directory in the `www` repository.

You must have a `.npmrc` file in the root of this project to point to the location of your `www` directory, e.g. `www=C:/Users/{user}/localwp/south-lacrosse/app/public`.

The following scripts are set up in `package.json` (run with `npm run script-name`):

* `build:blocks` - compile the production build of the blocks
* `build:blocks-map-dialog` - create the map dialog page from the source in [the location block](location/)
* `build:blocks-core` - compile the production build of our customisations of core blocks (e.g. to add compact class to tables)
* `format:blocks` - will change code to fit WordPress's recommended code style. Worth running after you have completed any modifications.
* `lint:css`, `lint:js` - check code style. You should have `eslint` installed in your code editor so styling errors are highlighted as you code, but this task should be run before committing code anyway.
* `start` - build a development version and watch the WordPress blocks to automatically recompile changes
* `start-core` - and a version to build and watch our core block customisations

It should be pretty obvious what each block does by its name, but you can also check the title and description in the `block.json` file.

Use the `start` scripts for testing, but make sure to run the `build` afterwards to get minified versions of the blocks. You will also need to commit your built changes from the `www` directory. And make sure not to commit any work in progress, you can always discard any changes to `www` and rebuild the blocks later.

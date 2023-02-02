# Custom Gutenberg Blocks

This is the source directory for our WordPress blocks. They are built using the WordPress provided `wp-scripts`, and compiled to the `plugin` directory in the `www` repository.

You must have a `.npmrc` file in the root of this project to point to the location of your `www` directory, e.g. `www=C:/Users/{user}/localwp/south-lacrosse/app/public`.

* `npm run build:blocks` - compile the production build of the blocks
* `npm run build:blocks-map-dialog` - create the map dialog page from the source in [the location block](location/)
* `npm run build:blocks-core` - compile the production build of our customisations of core blocks (e.g. to add compact class to tables)
* `npm run start` - build a development version and watch the WordPress blocks to automatically recompile changes
* `npm run start-core` - and a version to build and watch our core block customisations

It should be pretty obvious what each block does by its name, but you can also check the title and description in the `block.json` file.

Use the `start` scripts for testing, but make sure to run the `build` afterwards to get minified versions of the blocks. You will also need to commit your built changes from the `www` directory. And make sure not to commit any work in progress, you can always discard any changes to `www` and rebuild the blocks later.

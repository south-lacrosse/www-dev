# Custom Gutenberg Blocks

See also [debugging WordPress blocks](../../docs/development-help.md#debugging-wordpress-blocks).

This is the source directory for our WordPress blocks and other block editor related code. They are built using the WordPress provided `wp-scripts`, and compiled to the `plugin` directory in the `www` repository.

You must have a `.npmrc` file in the root of this project to point to the location of your `www` directory, e.g. `www=C:/Users/{user}/localwp/south-lacrosse/app/public`.

The following scripts are set up in `package.json` (run with `npm run script-name`):

* `start --block=core` - build a development version of a WordPress block or module, and watch to automatically recompile changes. `--block` must be the folder name of the block or module.
* `start-all` - development build and watch all blocks and modules
* `build:blocks` - build the production build of the blocks and modules, including building block metadata from all `block.json` files into a single manifest ([see below](#blocks-manifest))
* `build:blocks-map-dialog` - create the map dialog page from the source in [the map block](map/)
* `format:blocks` - will change code to fit WordPress's recommended code style. You should have `prettier` running in your editor, but if not run this after you have completed any modifications.
* `lint:css`, `lint:js` - check code style. You should have `eslint` installed in your code editor so styling errors are highlighted as you code, but this task should be run before committing code anyway.

Use the `start` script for testing, but make sure to run the `build:blocks` afterwards to get minified versions of the blocks. You will also need to commit your built changes from the `www` directory. And make sure not to commit any work in progress, you can always discard any changes to `www` and rebuild the blocks later.

It should be pretty obvious what each block does by its name, but you can also check the title and description in the `block.json` file in each directory. There are also the following non-block folders:

* `core` - modify core WordPress blocks. Includes custom controls to add our classes to certain core blocks; custom variations to add things like callouts; remove all comment blocks; remove variations we don't want e.g. many of the possible Social Icons variations.
* `editor` - modify the WordPress block editor. Blocks are loaded in several places, so this contains code which has a dependency of the editor `wp-edit-post` script that shouldn't be loaded in other contexts.

If you add new non-block modules then you should create a new folder for it, use `index.js` as the entry point so that `start` can find it, and add this to `webpack-full.config.js` in the project root so it gets included in the full `build:blocks`.

## Blocks Manifest

In order to improve block performance the `block.json` files can be pre-parsed into a manifest file, rather than these files having to be parsed each time. In our case we generate `core/blocks-manifest.php` as part of the `build:blocks` script, which is then loaded in `App.php` using `wp_register_block_metadata_collection()`. If you change any of the `block.json` files make sure to re-build this manifest file (this can be done separately with `build-blocks-manifest`), or for testing just comment out that call so the `block.json` files are parsed on each request (and of course, don't forget to remove that comment before committing, and rebuild the manifest).

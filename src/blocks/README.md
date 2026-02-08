# Custom Gutenberg Blocks

See also [debugging WordPress blocks](../../docs/development-help.md#debugging-wordpress-blocks).

This is the source directory for our WordPress blocks and other block editor related code. They are built using the WordPress provided `wp-scripts`, and compiled to the `plugin` directory in the `www` repository.

You **must** have the environment variable `SEMLA_WWW` set to point to the location of your `www` directory. Note that it should be in Unix style format even on Windows e.g. `set SEMLA_WWW=C:/Users/{user}/localwp/south-lacrosse/app/public`.

The following scripts are set up in `package.json` (run with `npm run script-name`):

* `start` - build a development version of a single WordPress block or module, and watch to automatically recompile changes. Environment variable `SEMLA_BLOCK` **must** be the folder name of the block or module.
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

In order to improve block performance the `block.json` files can be pre-parsed into a manifest file, rather than these files having to be parsed each time. In our case we generate `blocks/blocks-manifest.php` as part of the `build:blocks` and `start-all` scripts, which is then loaded in `App.php` using `wp_register_block_metadata_collection()`. Note that if you are working on a single block using the `start` script the manifest will not be regenerated, but if you are testing changes to the `block.json` file then you can just comment out that call so that all `block.json` files are parsed on each request (and of course, don't forget to uncomment before committing, and rebuild all the blocks using `build:blocks` so that the manifest is recreated).

## Block Icons

We use the standard [WordPress dashicons](https://developer.wordpress.org/resource/dashicons/) for many of the block icons as those are already built in (though you do have to enqueue the styles for the editor iframe to display in Placeholders), however WordPress only uses SVGs in core blocks, so going forward it may be a good idea to move to SVGs too.

See also the [developer info on icons](../../docs/developer-info.md#icons), which includes details on the The `@wordpress/icons` package, and how to get SVG versions of dashicons.

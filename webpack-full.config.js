// Custom build to add extra endpoints for non blocks, i.e. modules which don't
// have a block.json. This allows us to have one build, rather than having to
// run wp-scripts separately for blocks and non-blocks.

// Important: changing the entry points isn't documented, and is subject
// to change. If this config fails to compile all the modules check
// @wordpress/scripts/config/webpack.config.js

// Import the original config from the @wordpress/scripts package.
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Add any a new entry point by extending the webpack config.
module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		'core/index': './src/blocks/core/index.js',
		'editor/index': './src/blocks/editor/index.js',
	},
};

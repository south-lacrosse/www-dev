// Custom build to add extra endpoints for non blocks, i.e. modules which don't
// have a block.json. This allows us to have one build, rather than having to
// run wp-scripts separately for blocks and non-blocks.

// Import the original config from the @wordpress/scripts package.
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Import the helper to find and generate the entry points in the src directory
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils/config' );

// Add any a new entry point by extending the webpack config.
module.exports = {
	...defaultConfig,
	entry: {
		...getWebpackEntryPoints(),
		'core/index': './src/blocks/core/index.js',
		'editor/index': './src/blocks/editor/index.js',
	},
};

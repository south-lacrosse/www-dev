/**
 * Override the default WordPress webpack config to change the output
 * to our plugin directory.
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );
const path = require( 'path' );

module.exports = {
    ...defaultConfig,
	output: {
		filename: '[name].js',
		path: path.resolve( `${ process.env.npm_config_www }/wp-content/plugins/semla/blocks/` ),
    },
};
    
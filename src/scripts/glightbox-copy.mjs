import fs from 'fs';

if ( ! process.env.npm_config_www ) {
	process.stderr.write( 'No www environment variable set in .npmrc' );
	process.exit( 1 );
}

const src = './node_modules/glightbox/dist/';
const pluginDir = process.env.npm_config_www + '/wp-content/plugins/semla/';

try {
	[ 'css', 'js' ].forEach( ( type ) => {
		fs.copyFileSync(
			`${ src }${ type }/glightbox.min.${ type }`,
			`${ pluginDir }/${ type }/glightbox.min.${ type }`
		);
	} );
	process.stdout.write( 'glightbox js & css copied to plugin\n' );
} catch ( err ) {
	process.stderr.write( `Error: ${ err }\n` );
	process.exit( 1 );
}

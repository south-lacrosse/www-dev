import fs from 'fs';

if ( ! process.env.SEMLA_WWW ) {
	process.stderr.write( 'Environment variable SEMLA_WWW not set' );
	process.exit( 1 );
}

const src = './node_modules/glightbox/dist/';
const pluginDir = process.env.SEMLA_WWW + '/wp-content/plugins/semla/';

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

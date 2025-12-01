import fs from 'fs';

if ( ! process.env.SEMLA_WWW ) {
	throw new Error( 'Environment variable SEMLA_WWW not set' );
}

const src = './node_modules/glightbox/dist/';
const pluginDir = process.env.SEMLA_WWW + '/wp-content/plugins/semla/';

[ 'css', 'js' ].forEach( ( type ) => {
	fs.copyFileSync(
		`${ src }${ type }/glightbox.min.${ type }`,
		`${ pluginDir }/${ type }/glightbox.min.${ type }`
	);
} );
process.stdout.write( 'glightbox js & css copied to plugin\n' );

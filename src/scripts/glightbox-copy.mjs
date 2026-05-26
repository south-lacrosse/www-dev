import fs from 'fs';

const src = 'node_modules/glightbox/dist/';
const pluginDir = 'www/wp-content/plugins/semla/';

[ 'css', 'js' ].forEach( ( type ) => {
	fs.copyFileSync(
		`${ src }${ type }/glightbox.min.${ type }`,
		`${ pluginDir }/${ type }/glightbox.min.${ type }`
	);
} );
process.stdout.write( 'glightbox js & css copied to plugin\n' );

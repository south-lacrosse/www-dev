/**
 * Compress our custom glightbox-extra.js code, and bundle it with glightbox
 * into glightbox.bundle.js so we only need to send 1 file.
 */
import fs from 'fs';
import UglifyJS from 'uglify-js';

if ( ! process.env.SEMLA_WWW ) {
	process.stderr.write( 'Environment variable SEMLA_WWW not set' );
	process.exit( 1 );
}
const pluginDir = process.env.SEMLA_WWW + '/wp-content/plugins/semla/';

try {
	let output = fs.readFileSync( pluginDir + 'js/glightbox.min.js', 'utf8' );
	const minified = UglifyJS.minify(
		fs.readFileSync( pluginDir + 'js/glightbox-gallery.js', 'utf8' ),
		{ compress: { arrows: false } }
	);
	if ( minified.error ) {
		throw minified.error;
	}
	output += '\n' + minified.code;

	fs.writeFileSync( pluginDir + 'js/glightbox.bundle.min.js', output );
	process.stdout.write( 'glightbox bundle created\n' );
} catch ( err ) {
	process.stderr.write( `Error: ${ err }\n` );
	process.exit( 1 );
}

/**
 * Inline scripts and CSS into map dialog HTML
 */

import { inlineSource } from 'inline-source';
import fs from 'fs';

if ( ! process.env.SEMLA_WWW ) {
	process.stderr.write( 'Environment variable SEMLA_WWW not set' );
	process.exit( 1 );
}
const out =
	process.env.SEMLA_WWW + '/wp-content/plugins/semla/modal/map-dialog.html';

try {
	const html = await inlineSource( 'src/blocks/map/map-dialog.html', {
		compress: true,
		rootpath: 'src/blocks/map/',
	} );
	fs.writeFile( out, html, ( err ) => {
		if ( err ) {
			process.stderr.write( `Error: ${ err }\n` );
			return process.exit( 1 );
		}
		process.stderr.write( `Written to ${ out }\n` );
		process.exit( 0 );
	} );
} catch ( err ) {
	process.stderr.write( `Error: ${ err }\n` );
	process.exit( 1 );
}

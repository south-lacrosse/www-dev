/**
 * Inline scripts and CSS into map dialog HTML
 */

import { inlineSource } from 'inline-source';
import fs from 'fs';

if ( ! process.env.SEMLA_WWW ) {
	throw new Error( 'Environment variable SEMLA_WWW not set' );
}
const out =
	process.env.SEMLA_WWW + '/wp-content/plugins/semla/modal/map-dialog.html';

const html = await inlineSource( 'src/blocks/map/map-dialog.html', {
	compress: true,
	rootpath: 'src/blocks/map/',
} );
fs.writeFile( out, html, ( err ) => {
	if ( err ) {
		throw err;
	}
	process.stdout.write( `Written to ${ out }\n` );
} );

import { createBlock } from '@wordpress/blocks';

import { formatTel } from './utils';

const transforms = {
	from: [
		{
			type: 'raw',
			isMatch: ( node ) => {
				if ( node.nodeName !== 'P' ) return false;
				const text = node.innerHTML
					.replaceAll( '<br>', ' ' )
					.replace( /<a[^>]*href="(mailto|tel)[^>]*>/g, '' )
					.replaceAll( '</a>', '' );
				// must be plain text except the a tags removed above
				if ( text.includes( '<' ) ) return false;
				const split = text.split( ':' );
				if ( split.length !== 2 ) return false;
				const afterColon = split[ 1 ];
				const emailCount =
					afterColon.match(
						/\b[A-Za-z0-9._%+-]+\@[A-Za-z0-9._%+-]+\.[A-Za-z]+\b/g
					)?.length ?? 0;
				if ( emailCount > 1 ) return false;
				const telCount =
					afterColon.match( /\b\+?\d(?: ?\d){9,12}\b/g )?.length ?? 0;
				return telCount < 2 && ( emailCount > 0 || telCount > 0 );
			},
			transform: ( node ) => {
				return createContactBlock( node.innerHTML );
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: ( attributes ) =>
				attributes.map( ( { content } ) => {
					return createContactBlock( content );
				} ),
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'semla/attr-value' ],
			transform: ( attrValues ) =>
				attrValues.map( ( { attr, value, sameLine } ) => {
					const { text, email, tel } = parseAttributes( value );
					return createBlock( 'semla/contact', {
						role: attr,
						name: text,
						email,
						tel,
						sameLine,
					} );
				} ),
		},
	],
	to: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: ( contacts ) =>
				contacts.map( ( attributes ) => {
					return createBlock( 'core/paragraph', {
						content:
							`${ attributes.role }: ` + makeValue( attributes ),
					} );
				} ),
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'semla/attr-value' ],
			transform: ( contacts ) =>
				contacts.map( ( attributes ) => {
					return createBlock( 'semla/attr-value', {
						attr: attributes.role,
						value: makeValue( attributes ),
						sameLine: attributes.sameLine,
					} );
				} ),
		},
	],
};

export default transforms;

// Parse text, email, and tel from a string. Email and tel may be <a> tags, or
// plain text
function parseAttributes( content ) {
	// replace br with space, remove all tags except <a>
	content = content
		.replace( /<br[^>]*>/g, ' ' )
		.replace( /<(?!a |\/a>)[^>]*>/g, '' )
		.replaceAll( '&nbsp;', ' ' );
	let email = '',
		tel = '';
	// extract email
	let match = content.match( /<a href="mailto:([^"]+)"/ );
	if ( match ) {
		email = match[ 1 ].trim();
	} else {
		// no mailto link so try generic email match
		match = content.match(
			/\b[A-Za-z0-9._%+-]+\@[A-Za-z0-9._%+-]+\.[A-Za-z]+\b/
		);
		if ( match ) {
			email = match[ 0 ];
			// remove match from context
			content =
				content.substring( 0, match.index ) +
				content.substring( match.index + match[ 0 ].length );
		}
	}
	match = content.match( /<a href="tel:([^"]+)"/ );
	if ( match ) {
		tel = formatTel( match[ 1 ] );
	} else {
		// no tel: link to try generic telephone match. \b is word break, can't
		// use at start as + counts
		match = content.match( /(?:^| )\+?\d(?: ?\d){9,12}\b/ );
		if ( match ) {
			tel = formatTel( match[ 0 ] );
			content =
				content.substring( 0, match.index ) +
				content.substring( match.index + match[ 0 ].length );
		}
	}
	// remove links and extra spaces from text
	const text = content
		.replace( /<a[^>]*>[^>]*<\/a>/g, '' )
		.replace( /  +/g, ' ' )
		.trim();
	return { text, email, tel };
}

function createContactBlock( content ) {
	const { text, email, tel } = parseAttributes( content );
	let role = null,
		name = null;
	const colon = text.indexOf( ':' );
	if ( colon === -1 ) {
		role = text;
	} else {
		role = text.substring( 0, colon ).trim();
		name = text.substring( colon + 1 ).trim();
	}
	return createBlock( 'semla/contact', {
		role,
		name,
		email,
		tel,
	} );
}

// make an HTML string from the contact with name, and email and tel links
function makeValue( { name, email, tel } ) {
	let str = name?.trim() || '';
	if ( email ) {
		email = email.trim();
		if ( str ) str += '<br>';
		str += `<a href="mailto:${ email }">${ email }</a>`;
	}
	if ( tel ) {
		if ( str ) str += '<br>';
		str += `<a href="tel:${ tel.replaceAll( ' ', '' ) }">${ tel }</a>`;
	}
	return str;
}

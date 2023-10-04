import { createBlock } from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: ( attributes ) =>
				attributes.map( ( { content } ) => {
					const colon = content.indexOf( ':' );
					let attr = '',
						value = '';
					if ( colon === -1 ) {
						attr = content.trim();
					} else {
						// remove all html from attribute - it will be bold
						// anyway. If any closing tags are after the colon then
						// they will get tidied up by the RichText component
						attr = content
							.substring( 0, colon )
							.replace( /(<[^>]+>)/g, '' )
							.trim();
						value = content.substring( colon + 1 ).trim();
					}
					return createBlock( 'semla/attr-value', {
						attr,
						value,
					} );
				} ),
		},
	],
	to: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: ( attributes ) =>
				attributes.map( ( { attr, value } ) => {
					return createBlock( 'core/paragraph', {
						content: `${ attr }: ${ value }`,
					} );
				} ),
		},
	],
};

export default transforms;

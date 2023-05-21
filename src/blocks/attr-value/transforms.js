import { createBlock } from '@wordpress/blocks';
import blockMeta from './block.json';

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
						attr = content.substring( 0, colon ).trim();
						value = content.substring( colon + 1 ).trim();
					}
					return createBlock( blockMeta.name, {
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

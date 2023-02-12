/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import mapBlockMeta from './block.json';
import locationBlockMeta from '../location/block.json';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ locationBlockMeta.name ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock( locationBlockMeta.name, {}, [
					createBlock( mapBlockMeta.name, attributes, innerBlocks ),
				] );
			},
		},
	],
};

export default transforms;

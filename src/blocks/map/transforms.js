import { createBlock } from '@wordpress/blocks';
import mapBlockMeta from './block.json';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'semla/location' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock( 'semla/location', {}, [
					createBlock( mapBlockMeta.name, attributes, innerBlocks ),
				] );
			},
		},
	],
};

export default transforms;

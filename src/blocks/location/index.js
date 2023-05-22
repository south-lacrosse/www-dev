/**
 * SEMLA Location - includes address, inner blocks for notes, Google map &
 * directions
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	PlainText,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import metadata from './block.json';

const template = [
	[
		'core/paragraph',
		{
			content: 'Notes to always display e.g. non-grass pitch',
		},
	],
	[ 'semla/map', {} ],
];

// Note: because of https://github.com/WordPress/gutenberg/issues/14515
// make sure to have different top level arrays which useMemo won't think are
// equal, i.e. if you compare elements up to smallest array size. Easist to just
// make first element different
const ALLOWED_BLOCKS = [ 'core/image', 'core/paragraph' ];
const ALLOWED_BLOCKS_PLUS_MAP = [ 'semla/map', ...ALLOWED_BLOCKS ];

function Edit( { clientId, attributes: { address }, setAttributes } ) {
	const hasMap = useSelect(
		( select ) =>
			!! select( blockEditorStore )
				.getBlock( clientId )
				.innerBlocks.find( ( block ) => block.name === 'semla/map' ),
		[]
	);

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title="Help" initialOpen={ true }>
					<p>Enter address, any notes, and add a Map block.</p>
					<p>
						Don&apos;t put important instructions that should always
						be displayed directly below the map (e.g. non-grass
						types and required footwear, non-standard start times),
						as that will be hidden when the page is initially
						displayed.
					</p>
				</PanelBody>
			</InspectorControls>
			<PlainText
				value={ address }
				placeholder="Address"
				onChange={ ( val ) => {
					setAttributes( { address: val } );
				} }
			/>
			<InnerBlocks
				allowedBlocks={
					hasMap ? ALLOWED_BLOCKS : ALLOWED_BLOCKS_PLUS_MAP
				}
				template={ template }
			/>
		</div>
	);
}

function save( { attributes: { address } } ) {
	return (
		<div { ...useBlockProps.save() }>
			<p>{ address }</p>
			<InnerBlocks.Content />
		</div>
	);
}

registerBlockType( metadata.name, { edit: Edit, save } );

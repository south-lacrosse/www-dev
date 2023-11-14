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
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import metadata from './block.json';

const TEMPLATE = [
	[
		'core/paragraph',
		{
			content: 'Notes to always display e.g. non-grass pitch',
		},
	],
	[ 'semla/map', {} ],
];

const ALLOWED_BLOCKS = [ 'core/image', 'core/paragraph' ];
const ALLOWED_BLOCKS_PLUS_MAP = [ 'semla/map', ...ALLOWED_BLOCKS ];

function Edit( {
	clientId,
	attributes: { address, mapperLinks },
	setAttributes,
} ) {
	const hasMap = useSelect(
		( select ) =>
			!! select( blockEditorStore )
				.getBlock( clientId )
				.innerBlocks.find( ( block ) => block.name === 'semla/map' ),
		[ clientId ]
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
				<PanelBody title="Settings">
					<ToggleControl
						label="Mapper Links"
						help="Add mapper links to address on front end (currently CityMapper)"
						checked={ mapperLinks }
						onChange={ ( val ) => {
							setAttributes( { mapperLinks: val } );
						} }
					/>
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
				template={ TEMPLATE }
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

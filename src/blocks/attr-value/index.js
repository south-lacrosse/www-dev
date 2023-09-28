/**
 * Gutenberg block for attribute-value field
 */
import {
	BlockControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { formatIndent } from '@wordpress/icons';

import metadata from './block.json';
import transforms from './transforms';

function Edit( { attributes, setAttributes } ) {
	const { attr, value, sameLine } = attributes;
	const blockProps = useBlockProps( {
		className: sameLine ? 'avf-same-line' : '',
	} );

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ formatIndent }
						label="Put value on line below attribute"
						isActive={ ! sameLine }
						onClick={ () => {
							setAttributes( {
								sameLine: ! sameLine,
							} );
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
			<RichText
				tagName="div"
				className="avf-name"
				allowedFormats={ [] }
				withoutInteractiveFormatting
				value={ attr }
				placeholder="Attribute"
				onChange={ ( val ) => setAttributes( { attr: val } ) }
			/>
			<RichText
				tagName="div"
				className="avf-value"
				value={ value }
				placeholder="Value"
				onChange={ ( val ) => setAttributes( { value: val } ) }
			/>
		</div>
	);
}

function save( { attributes } ) {
	const { attr, value, sameLine } = attributes;
	const blockProps = useBlockProps.save( {
		className: sameLine ? 'avf-same-line' : '',
	} );
	return (
		<div { ...blockProps }>
			<RichText.Content
				tagName="div"
				className="avf-name"
				value={ attr }
			/>
			<RichText.Content
				tagName="div"
				className="avf-value"
				value={ value }
			/>
		</div>
	);
}

registerBlockType( metadata.name, { edit: Edit, save, transforms } );

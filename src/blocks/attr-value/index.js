/**
 * Gutenberg block for attribute-value field
 */
import {
	BlockControls,
	PlainText,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { formatIndent } from '@wordpress/icons';

import metadata from './block.json';

function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( {
		className: attributes.sameLine ? 'avf-same-line' : '',
	} );

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ formatIndent }
						label="Put value on line below attribute"
						isActive={ ! attributes.sameLine }
						onClick={ () => {
							setAttributes( {
								sameLine: ! attributes.sameLine,
							} );
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div className="avf-name">
				<PlainText
					value={ attributes.attr }
					placeholder="Attribute"
					onChange={ ( val ) => setAttributes( { attr: val } ) }
				/>
			</div>
			{ attributes.sameLine && (
				<div style={ { display: 'table-cell', width: '1em' } }>:</div>
			) }
			<RichText
				tagName="div"
				className="avf-value"
				value={ attributes.value }
				placeholder="Value"
				onChange={ ( val ) => setAttributes( { value: val } ) }
			/>
		</div>
	);
}

function save( { attributes } ) {
	const blockProps = useBlockProps.save( {
		className: attributes.sameLine ? 'avf-same-line' : '',
	} );
	return (
		<div { ...blockProps }>
			<div className="avf-name">{ attributes.attr }</div>
			<RichText.Content
				tagName="div"
				className="avf-value"
				value={ attributes.value }
			/>
		</div>
	);
}

registerBlockType( metadata.name, { edit: Edit, save } );

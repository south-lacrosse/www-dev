/**
 * Gutenberg block for table of contents
 * Cribbed from https://wordpress.org/plugins/ultimate-blocks/#developers
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import TableOfContents from './TableOfContents';

import metadata from './block.json';

function Edit( { attributes, setAttributes, isSelected } ) {
	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Help" initialOpen={ true }>
					<p>
						Set the HTML anchor of the headings to change the
						name of the internal links (you can find this in the
						Settings for the header blocks under Advanced).
					</p>
				</PanelBody>
			</InspectorControls>
			<div id="semla_toc">
				<nav id="semla_toc-nav">
					{ isSelected && (
						<TextControl
							placeholder={ 'Title' }
							onChange={ ( text ) =>
								setAttributes( { title: text } )
							}
							value={ attributes.title }
							keepPlaceholderOnFocus={ true }
						/>
					) }
					{ ! isSelected && attributes.title && (
						<h4>{ attributes.title }</h4>
					) }
					<TableOfContents
						value={ attributes.toc }
						onChange={ ( val ) =>
							setAttributes( { toc: val } )
						}
					/>
				</nav>
			</div>
		</div>
	);
}

function save( { attributes } ) {
	return (
		<div id="semla_toc" {...useBlockProps.save()}>
			<nav id="semla_toc-nav">
				{ attributes.title.trim().length > 0 && (
					<h4>{ attributes.title.trim() }</h4>
				) }
				<TableOfContents.Content value={ attributes.toc } />
			</nav>
		</div>
	);
};

registerBlockType( metadata.name, { edit: Edit, save } );

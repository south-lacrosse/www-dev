/**
 * Gutenberg block for table of contents
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { Disabled, PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { RawHTML, useEffect } from '@wordpress/element';

import metadata from './block.json';

function Edit( { attributes, setAttributes, isSelected } ) {
	const { title, toc } = attributes;

	const latestToc = useSelect( ( select ) => {
		const rootBlocks = select( blockEditorStore ).getBlocks();
		const tocTree = [];
		rootBlocks.forEach( ( block ) => {
			extractHeadings( block, tocTree );
		} );
		return tocTree.length === 0 ? '' : createHtml( tocTree );
	}, [] );

	// use an effect to setAttributes, so that it is only called when latestToc changes.
	useEffect( () => {
		if ( latestToc !== toc ) {
			setAttributes( { toc: latestToc } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ latestToc ] );

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title="Help" initialOpen={ true }>
					<p>
						Set the HTML anchor of the headings to change the name
						of the internal links (you can find this in the Settings
						for the header blocks under Advanced).
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
							value={ title }
							keepPlaceholderOnFocus={ true }
						/>
					) }
					{ ! isSelected && title && <h4>{ title }</h4> }
					<Disabled>{ content( toc ) }</Disabled>
				</nav>
			</div>
		</div>
	);
}

function save( { attributes } ) {
	const { title, toc } = attributes;
	return (
		<div id="semla_toc" { ...useBlockProps.save() }>
			<nav id="semla_toc-nav">
				{ title.trim().length > 0 && <h4>{ title.trim() }</h4> }
				{ content( toc ) }
			</nav>
		</div>
	);
}

registerBlockType( metadata.name, { edit: Edit, save } );

function content( toc ) {
	// note: <ul> is inside RawHTML as in editor RawHTML will include <div>, so we
	// need to make sure the div is outside the ul (removes when serialising)
	return <RawHTML>{ '<ul id="semla_toc-list">' + toc + '</ul>' }</RawHTML>;
}

// Extract headings, and recurse through inner blocks
function extractHeadings( block, tocTree ) {
	if ( block.name === 'core/heading' ) {
		addToTocTree( block, tocTree );
		return;
	}
	block.innerBlocks.forEach( ( innerBlock ) => {
		extractHeadings( innerBlock, tocTree );
	} );
}

// Find correct place to insert heading into Table of Contents
function addToTocTree( block, tocTree ) {
	// Heading blocks have attributes for the content (rich-text), level,
	// also supports anchor
	const attributes = block.attributes;

	if ( ! attributes.content || ! attributes.content.text ) {
		return;
	}
	// if a heading has no anchor then make sure we add one
	if ( ! attributes.anchor || attributes.anchor.startsWith( 'st-' ) ) {
		attributes.anchor =
			'st-' +
			attributes.content.text
				.replace( / +/g, '-' )
				.replace( /[^\w\s-]/g, '' );
	}
	// need to copy to new object as we'll be adding children
	const node = {
		level: attributes.level,
		content: attributes.content.text,
		anchor: attributes.anchor,
	};

	if ( tocTree.length === 0 ) {
		tocTree.push( node );
		return;
	}

	// eslint-disable-next-line no-constant-condition
	while ( true ) {
		// look at last item in current level in table of contents
		const last = tocTree[ tocTree.length - 1 ];
		if ( node.level <= last.level ) {
			tocTree.push( node );
			return;
		}
		// needs to go in child level - let's see if that exists yet
		if ( ! last.children ) {
			// nope - so create children array
			last.children = [ node ];
			return;
		}
		// look next level down
		tocTree = last.children;
	}
}

function createHtml( tocTree ) {
	let html = '';
	tocTree.forEach( ( item ) => {
		html += `<li><a href="#${ item.anchor }">${ item.content }</a>`;
		if ( item.children ) {
			html += '<ul>' + createHtml( item.children ) + '</ul>';
		}
		html += '</li>';
	} );
	return html;
}

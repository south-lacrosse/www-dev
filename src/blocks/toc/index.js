/**
 * Gutenberg block for table of contents
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Disabled,
	PanelBody,
	TextControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { RawHTML, useEffect } from '@wordpress/element';
import { alignNone, pullRight } from '@wordpress/icons';

import metadata from './block.json';

function Edit( { attributes, setAttributes, isSelected } ) {
	const { title, toc, floatRight } = attributes;

	const [ latestToc, headingsWithoutAnchor ] = useSelect( ( select ) => {
		const rootBlocks = select( blockEditorStore ).getBlocks();
		const tocAttrs = { tree: [], headingsWithoutAnchor: false };
		rootBlocks.forEach( ( block ) => {
			extractHeadings( block, tocAttrs );
		} );
		return [
			tocAttrs.tree.length === 0 ? '' : createHtml( tocAttrs.tree ),
			tocAttrs.headingsWithoutAnchor,
		];
	}, [] );

	// use an effect to setAttributes, so that it is only called when latestToc changes.
	useEffect( () => {
		if ( latestToc !== toc ) {
			setAttributes( { toc: latestToc } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ latestToc ] );

	const blockProps = useBlockProps( {
		className: floatRight ? '' : 'semla_toc-floatnone',
	} );
	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ alignNone }
						label="Full width"
						isActive={ ! floatRight }
						onClick={ () => {
							setAttributes( {
								floatRight: false,
							} );
						} }
					/>
					<ToolbarButton
						icon={ pullRight }
						label="Float right"
						isActive={ floatRight }
						onClick={ () => {
							setAttributes( {
								floatRight: true,
							} );
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title="Help" initialOpen={ true }>
					<p>
						Add heading blocks and set their HTML anchor to add to
						the table of contents (you can find this in the block
						Settings under Advanced). The anchor will become the
						name of the internal link. Open the Document Overview to
						see all the blocks and their anchors.
					</p>
				</PanelBody>
			</InspectorControls>
			<nav className="semla_toc-nav">
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
				{ ! isSelected && title && <h2>{ title }</h2> }
				{ toc ? (
					<>
						<Disabled>{ tocUlHtml( toc ) }</Disabled>
						{ headingsWithoutAnchor && (
							<p>
								<i>
									There are { headingsWithoutAnchor } headings
									without anchors which won&apos;t appear
									here.
								</i>
							</p>
						) }
					</>
				) : (
					<p>
						Start adding Heading blocks to create a table of
						contents. Headings with HTML anchors will be linked
						here.
					</p>
				) }
			</nav>
		</div>
	);
}

function save( { attributes } ) {
	const { title, toc, floatRight } = attributes;
	const blockProps = useBlockProps.save( {
		className: floatRight ? '' : 'semla_toc-floatnone',
	} );
	return (
		<div { ...blockProps }>
			<nav className="semla_toc-nav">
				{ title.trim().length > 0 && <h2>{ title.trim() }</h2> }
				{ tocUlHtml( toc ) }
			</nav>
		</div>
	);
}

registerBlockType( metadata.name, { edit: Edit, save } );

function tocUlHtml( toc ) {
	// note: <ul> is inside RawHTML as in editor RawHTML will include <div>, so we
	// need to make sure the div is outside the ul (removes when serialising)
	return <RawHTML>{ '<ul id="semla_toc-list">' + toc + '</ul>' }</RawHTML>;
}

// Extract headings with anchors, and recurse through inner blocks
function extractHeadings( block, tocAttrs ) {
	if ( block.name === 'core/heading' ) {
		if ( block.attributes.anchor ) {
			addToTocTree( block, tocAttrs.tree );
		} else {
			tocAttrs.headingsWithoutAnchor++;
		}
		return;
	}
	block.innerBlocks.forEach( ( innerBlock ) => {
		extractHeadings( innerBlock, tocAttrs );
	} );
}

// Find correct place to insert heading into Table of Contents
function addToTocTree( block, tree ) {
	// Heading blocks have attributes for the content (rich-text), level,
	// and anchor
	const attributes = block.attributes;

	if ( ! attributes.content || ! attributes.content.text ) {
		return;
	}
	// use toString to get HTML with entities (&amp;), and then remove any html
	// tags
	const content = attributes.content
		.toString()
		.replace( /<[^>]+>/g, '' )
		.replace( /  +/g, ' ' );
	// need to copy to new object as we'll be adding children
	const node = {
		level: attributes.level,
		content,
		anchor: attributes.anchor,
	};

	if ( tree.length === 0 ) {
		tree.push( node );
		return;
	}

	// eslint-disable-next-line no-constant-condition
	while ( true ) {
		// look at last item in current level in table of contents
		const last = tree[ tree.length - 1 ];
		if ( node.level <= last.level ) {
			tree.push( node );
			return;
		}
		// needs to go in child level - let's see if that exists yet
		if ( ! last.children ) {
			// nope - so create children array
			last.children = [ node ];
			return;
		}
		// look next level down
		tree = last.children;
	}
}

function createHtml( tree ) {
	let html = '';
	tree.forEach( ( item ) => {
		html += `<li><a href="#${ item.anchor }">${ item.content }</a>`;
		if ( item.children ) {
			html += '<ul>' + createHtml( item.children ) + '</ul>';
		}
		html += '</li>';
	} );
	return html;
}

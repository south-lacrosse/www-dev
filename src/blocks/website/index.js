/**
 * Website link
 */
import {
	InnerBlocks,
	URLPopover,
	URLInput,
	useBlockProps,
} from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { keyboardReturn } from '@wordpress/icons';
import icon from './chain';
import { filterURLForDisplay } from '@wordpress/url';

import metadata from './block.json';

function WebsiteURLPopover( {
	url,
	setAttributes,
	setPopover,
	popoverAnchor,
} ) {
	const [ newUrl, setNewUrl ] = useState( url );
	return (
		<URLPopover
			anchor={ popoverAnchor }
			onClose={ () => {
				setPopover( false );
				popoverAnchor?.focus();
			} }
		>
			<form
				className="block-editor-url-popover__link-editor"
				onSubmit={ ( event ) => {
					event.preventDefault();
					setAttributes( { url: cleanUrl( newUrl ) } );
					setPopover( false );
					popoverAnchor?.focus();
				} }
			>
				<div className="block-editor-url-input">
					<URLInput
						__nextHasNoMarginBottom
						value={ newUrl }
						onChange={ ( val ) => setNewUrl( val ) }
						placeholder="Enter website address"
						disableSuggestions={ true }
					/>
				</div>
				<Button icon={ keyboardReturn } label="Apply" type="submit" />
			</form>
		</URLPopover>
	);
}

function Edit( { attributes, setAttributes, isSelected } ) {
	const { url } = attributes;
	let displayUrl = '';
	if ( url ) {
		displayUrl = filterURLForDisplay( url );
	}
	if ( ! displayUrl ) {
		displayUrl = 'Set website';
	}

	const [ showURLPopover, setPopover ] = useState( false );
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	// see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/social-link/edit.js
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	const onWebsiteUrlClick = ( event ) => {
		event.preventDefault();
		setPopover( true );
	};

	return (
		<p { ...useBlockProps() }>
			Website:&nbsp;
			<a
				href={ url }
				ref={ setPopoverAnchor }
				onClick={ onWebsiteUrlClick }
			>
				{ displayUrl }
			</a>
			{ isSelected && showURLPopover && (
				<WebsiteURLPopover
					url={ url }
					setAttributes={ setAttributes }
					setPopover={ setPopover }
					popoverAnchor={ popoverAnchor }
				/>
			) }
		</p>
	);
}

function save() {
	return <InnerBlocks.Content />;
}

registerBlockType( metadata.name, { icon, edit: Edit, save } );

// Helpers

/**
 * Add https: if no scheme specified, add trailing slash if missing
 * @param {string} url URL to translate
 */
function cleanUrl( url ) {
	return encodeURI( url.trim() )
		.replace( /^(?:(.*:)?\/\/)?(.*)/i, ( match, schemma, nonSchemaUrl ) =>
			schemma ? match : `https://${ nonSchemaUrl }`
		)
		.replace( /(\/\/[^\/]+?)(\?|#|$)/, '$1/$2' );
}

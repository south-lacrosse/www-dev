/**
 * Modify WordPress core blocks.
 *
 * - Add our styles to core components (maybe too much integration with plugin/theme?)
 *
 * See https://developer.wordpress.org/block-editor/developers/filters/block-filters/
 */
import classnames from 'classnames';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { registerBlockStyle, unregisterBlockType } from '@wordpress/blocks';
import { PanelBody, ToggleControl, ToolbarGroup } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';
import { lineSpacingIcon } from './icons';
import './core.scss';

/*
 * Block styles are options for the whole block, and replace each other - so
 * you can only have 1 of the styles
 */
registerBlockStyle( 'core/list', [
	{
		name: 'alpha',
		label: 'Alphabetic',
	},
	{
		name: 'roman',
		label: 'Roman numerals',
	},
	{
		name: 'unstyled',
		label: 'Unstyled',
	},
] );
registerBlockStyle( 'core/table', [
	{
		name: 'lined',
		label: 'Lined',
	},
	{
		name: 'boxed-striped',
		label: 'Boxed and striped',
	},
] );

domReady( function () {
	unregisterBlockType( 'core/audio' );
	unregisterBlockType( 'core/latest-comments' );
	unregisterBlockType( 'core/video' );
} );

/**
 * Now we are going to add custom attributes & classes to core blocks. These
 *  attributes will control whether a CSS class gets added to the generated
 *  element.
 *
 * The CSS classes for each tag are:
 *  table - 'compact' to remove width 100%
 *  list - 'spaced' or 'medium-spaced' to increase space between list items
 *  p - 'no-print' to remove from printed page
 *
 * There are 4 components to doing this (all via filters):
 *  1. Add our attributes to the core block type
 *  2. Add controls to the core block's inspector or toolbar to set that attribute
 *  3. Add our class to the block wrapper in the editor (IMHO you should be able
 *      to do this in step 2, but as of WP 5.5.3 this doesn't work, though there
 *      does seem to be a request to do this).
 *  4. Add our class to the generated core block element
 */

addFilter(
	'blocks.registerBlockType',
	'semla/custom-attributes',
	( settings, name ) => {
		switch ( name ) {
			case 'core/paragraph':
				settings.attributes = Object.assign( settings.attributes, {
					noPrint: {
						type: 'boolean',
						default: false,
					},
				} );
				break;
			case 'core/list':
				settings.attributes = Object.assign( settings.attributes, {
					spacing: {
						type: 'string',
						default: null,
					},
				} );
				break;
			case 'core/table':
				settings.attributes = Object.assign( settings.attributes, {
					compact: {
						type: 'boolean',
						default: false,
					},
				} );
				break;
		}
		return settings;
	}
);

/** add controls to core blocks */
addFilter(
	'editor.BlockEdit',
	'semla/custom-controls',
	createHigherOrderComponent( ( BlockEdit ) => {
		return ( props ) => {
			switch ( props.name ) {
				case 'core/paragraph': {
					const { noPrint } = props.attributes;
					return (
						<>
							<BlockEdit { ...props } />
							<InspectorControls>
								<PanelBody title="Print Options">
									<ToggleControl
										label="Don't print"
										checked={ noPrint }
										onChange={ ( value ) =>
											props.setAttributes( {
												noPrint: value,
											} )
										}
										help={
											noPrint
												? 'Remove from printed page.'
												: 'Show on printed page.'
										}
									/>
								</PanelBody>
							</InspectorControls>
						</>
					);
				}
				case 'core/list': {
					const spacings = [
						[ null, 'Regular spaced' ],
						[ 'medium-spaced', 'Medium spaced' ],
						[ 'spaced', 'Large Spaced' ],
					];
					const { spacing } = props.attributes;
					return (
						<>
							<BlockEdit { ...props } />
							<BlockControls>
								<ToolbarGroup
									isCollapsed={ true }
									icon={ lineSpacingIcon }
									label="Set spacing"
									popoverProps={ {
										position: 'bottom right',
										isAlternate: true,
									} }
									controls={ spacings.map( ( control ) => {
										const [ val, title ] = control;
										return {
											icon: lineSpacingIcon,
											title,
											isActive: val === spacing,
											onClick: () => {
												props.setAttributes( {
													spacing: val,
												} );
											},
										};
									} ) }
								/>
							</BlockControls>
						</>
					);
				}
				case 'core/table': {
					const { compact } = props.attributes;
					return (
						<>
							<BlockEdit { ...props } />
							<InspectorControls>
								<PanelBody title="Formatting">
									<ToggleControl
										label="Compact"
										checked={ compact }
										onChange={ ( value ) =>
											props.setAttributes( {
												compact: value,
											} )
										}
										help={
											compact
												? "Don't use full width of page."
												: 'Use full page width.'
										}
									/>
								</PanelBody>
							</InspectorControls>
						</>
					);
				}
				default:
					return <BlockEdit { ...props } />;
			}
		};
	}, 'coreBlockInspectorControls' )
);

/** Add class to block wrapper in editor */
addFilter(
	'editor.BlockListBlock',
	'semla/with-custom-classes',
	createHigherOrderComponent( ( BlockListBlock ) => {
		return ( props ) => {
			switch ( props.name ) {
				case 'core/list': {
					if ( props.attributes.spacing ) {
						return (
							<BlockListBlock
								{ ...props }
								className={ props.attributes.spacing }
							/>
						);
					}
					break;
				}
				case 'core/table': {
					if ( props.attributes.compact ) {
						return (
							<BlockListBlock { ...props } className="compact" />
						);
					}
					break;
				}
			}
			return <BlockListBlock { ...props } />;
		};
	}, 'withCustomClasses' )
);

/** Add class to block wrapper on save */
addFilter(
	'blocks.getSaveContent.extraProps',
	'semla/custom-class',
	( extraProps, blockType, attributes ) => {
		switch ( blockType.name ) {
			case 'core/paragraph':
				if ( attributes.noPrint ) {
					extraProps.className = classnames(
						extraProps.className,
						'no-print'
					);
				}
				break;
			case 'core/list':
				if ( attributes.spacing ) {
					extraProps.className = classnames(
						extraProps.className,
						attributes.spacing
					);
				}
				break;
			case 'core/table':
				if ( attributes.compact ) {
					extraProps.className = classnames(
						extraProps.className,
						'compact'
					);
				}
				break;
		}
		return extraProps;
	}
);

/**
 * Modify WordPress core blocks.
 *
 * - Add controls to set our custom classes to core blocks, e.g. "compact" on
 *    table (maybe too much integration with plugin/theme?)
 * - remove all comment blocks, plus audio and video
 */
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import {
	getBlockTypes,
	unregisterBlockType,
	unregisterBlockVariation,
} from '@wordpress/blocks';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import domReady from '@wordpress/dom-ready';
import { useEffect, useRef } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { external } from '@wordpress/icons';
import { PluginMoreMenuItem } from '@wordpress/edit-post';
import { registerPlugin } from '@wordpress/plugins';
import LineSpacingIcon from './line-spacing-icon';
import { hasClass, replaceClasses, toggleClass } from './class-utils';

import './editor.css';

domReady( function () {
	unregisterBlockType( 'core/audio' );
	unregisterBlockType( 'core/video' );
	const commentRegex = /^core\/.*comment/;
	getBlockTypes().forEach( ( block ) => {
		if ( block.name.match( commentRegex ) ) {
			unregisterBlockType( block.name );
		}
	} );

	// Remove unwanted variations. If you want to see what they are then:
	// wp.blocks
	// 	.getBlockVariations( 'core/social-link' )
	// 	.sort( ( a, b ) => a.name.localeCompare( b.name ) )
	// 	.reduce( ( accum, val ) => {
	// 		return ( accum ? accum + ',' : '' ) + `'${ val.name }'`;
	// 	}, '' );
	//
	// You might also want to remove core/embed variations

	// Allowed variations are commented out. Note that we don't have a whitelist
	// so that any future variations are allowed until they are explicitly
	// removed.
	[
		'amazon',
		'bandcamp',
		'behance',
		// 'chain',
		'codepen',
		'deviantart',
		'dribbble',
		'dropbox',
		'etsy',
		// 'facebook',
		'feed',
		'fivehundredpx',
		'flickr',
		'foursquare',
		'github',
		'goodreads',
		'google',
		// 'instagram',
		'lastfm',
		'linkedin',
		// 'mail',
		'mastodon',
		'medium',
		'meetup',
		'patreon',
		'pinterest',
		'pocket',
		'reddit',
		'skype',
		'snapchat',
		'soundcloud',
		'spotify',
		'telegram',
		'tiktok',
		'tumblr',
		'twitch',
		// 'twitter',
		'vimeo',
		'vk',
		'whatsapp',
		'wordpress',
		'yelp',
		// 'youtube',
	].forEach( ( variation ) =>
		unregisterBlockVariation( 'core/social-link', variation )
	);
} );

/**
 * Add controls to the core blocks to add our classes to the block's className.
 */
const addCoreBlocksControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		let controls;
		switch ( props.name ) {
			case 'core/paragraph':
				controls = paragraphControls;
				break;
			case 'core/list':
				controls = ListControls;
				break;
			case 'core/table':
				controls = tableControls;
				break;
			default:
				return <BlockEdit { ...props } />;
		}
		return (
			<>
				<BlockEdit { ...props } />
				{ controls( props ) }
			</>
		);
	};
}, 'coreBlocksControls' );
addFilter(
	'editor.BlockEdit',
	'semla/custom-core-controls',
	addCoreBlocksControls
);

function paragraphControls( props ) {
	const className = props.attributes.className;
	const noPrint = hasClass( className, 'no-print' );

	return (
		<InspectorControls>
			<PanelBody title="Print Options">
				<ToggleControl
					label="Don't print"
					checked={ noPrint }
					onChange={ () => {
						props.setAttributes( {
							className: toggleClass( className, 'no-print' ),
						} );
					} }
					help={
						noPrint
							? 'Remove from printed page.'
							: 'Show on printed page.'
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

const listSpacingOptions = [
	{ label: 'Regular spaced', value: '' },
	{ label: 'Medium spaced', value: 'medium-spaced' },
	{ label: 'Large Spaced', value: 'spaced' },
];
const orderedListStyleOptions = [
	{ label: 'Default', value: '' },
	{ label: 'Alphabetic', value: 'is-style-alpha' },
	{ label: 'Roman numerals', value: 'is-style-roman' },
];
const unstyledClass = 'is-style-unstyled';

function orderedListStyleControls( className, setAttributes ) {
	const style = getOption( className, orderedListStyleOptions );
	return (
		<SelectControl
			value={ style }
			options={ orderedListStyleOptions }
			onChange={ ( newStyle ) =>
				setAttributes( {
					className: changeOption(
						className,
						newStyle,
						orderedListStyleOptions
					),
				} )
			}
		/>
	);
}

function unorderedListStyleControls( className, setAttributes ) {
	const isUnstyled = hasClass( className, unstyledClass );
	return (
		<ToggleControl
			label="Unstyled"
			checked={ isUnstyled }
			onChange={ () => {
				setAttributes( {
					className: toggleClass( className, unstyledClass ),
				} );
			} }
		/>
	);
}

function ListControls( { attributes, setAttributes } ) {
	const { className, ordered } = attributes;

	const isFirstRender = useRef( true );
	// When switching between ordered and unordered make sure we remove classes
	// of the other list type
	useEffect( () => {
		if ( isFirstRender.current ) {
			isFirstRender.current = false;
			return;
		}
		const newClass = ordered
			? replaceClasses( className, [ unstyledClass ], '' )
			: changeOption( className, '', orderedListStyleOptions );
		if ( newClass !== className ) {
			setAttributes( { className: newClass } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ ordered ] );

	const spacing = getOption( className, listSpacingOptions );

	const spacingControls = listSpacingOptions.map( ( option ) => {
		const { label, value } = option;
		return {
			role: 'menuitemradio',
			title: label,
			icon: LineSpacingIcon,
			isActive: value === spacing,
			onClick: () => {
				setAttributes( {
					className: changeOption(
						className,
						value,
						listSpacingOptions
					),
				} );
			},
		};
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={
						( ordered ? 'Ordered' : 'Unordered' ) + ' list style'
					}
				>
					{ ordered
						? orderedListStyleControls( className, setAttributes )
						: unorderedListStyleControls(
								className,
								setAttributes
						  ) }
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						isCollapsed={ true }
						icon={ LineSpacingIcon }
						label="Set spacing"
						controls={ spacingControls }
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
}

function tableControls( props ) {
	const className = props.attributes.className;
	const isCompact = hasClass( className, 'compact' );
	return (
		<InspectorControls>
			<PanelBody title="Formatting">
				<ToggleControl
					label="Compact"
					checked={ isCompact }
					onChange={ () => {
						props.setAttributes( {
							className: toggleClass( className, 'compact' ),
						} );
					} }
					help={
						isCompact
							? "Don't use full width of page."
							: 'Use full page width.'
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * Add an item to the Options menu (3 vertical dots) under Plugins
 */
function HelpMoreMenuItem() {
	return (
		<PluginMoreMenuItem
			icon={ external }
			href="https://south-lacrosse.github.io/wp-help/"
			target="_blank"
			rel="noopener noreferrer"
		>
			SEMLA Help
		</PluginMoreMenuItem>
	);
}
registerPlugin( 'semla-help', {
	render: HelpMoreMenuItem,
} );

/* --------------------- Utilities ----------------------- */

/*
 * Find out which of our options is in the className. Assumes first is '' for
 * default
 */
function getOption( className, options ) {
	for ( let i = 1; i < options.length; i++ ) {
		if ( hasClass( className, options[ i ].value ) ) {
			return options[ i ].value;
		}
	}
	return '';
}

/*
 * Return className with the newClass added, and any other of the options
 * removed
 */
function changeOption( className, newClass, options ) {
	const classesToRemove = [];
	for ( let i = 0; i < options.length; i++ ) {
		const cls = options[ i ].value;
		if ( cls && cls !== newClass ) {
			classesToRemove.push( cls );
		}
	}
	return replaceClasses( className, classesToRemove, newClass );
}

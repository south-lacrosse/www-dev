/**
 * Modify WordPress core blocks.
 *
 * - Add controls to set our custom classes to core blocks, e.g. "compact" on
 *    table
 * - remove all comment blocks, plus audio and video
 * - remove unwanted variations of social links
 * - add Callout variations
 */
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import {
	getBlockTypes,
	registerBlockVariation,
	unregisterBlockType,
	unregisterBlockVariation,
} from '@wordpress/blocks';
import {
	PanelBody,
	ToggleControl,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import domReady from '@wordpress/dom-ready';
import { useEffect, useRef } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import LineSpacingIcon from './line-spacing-icon';
import InformationIcon from './information-icon';
import { hasClass, replaceClasses, toggleClass } from './class-utils';

import './editor.css';

domReady( function () {
	unregisterBlockType( 'core/audio' );
	unregisterBlockType( 'core/video' );
	getBlockTypes().forEach( ( block ) => {
		if ( block.name.match( /^core\/.*comment/ ) ) {
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
		// 'tiktok',
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

/*
 * Add controls to the core blocks to add our custom classes to the block's className.
 */
addFilter(
	'editor.BlockEdit',
	'semla/custom-core-controls',
	( BlockEdit ) => ( props ) => {
		if ( props.name === 'core/list' ) {
			return (
				<>
					<ListControls
						className={ props.attributes.className }
						ordered={ props.attributes.ordered }
						setAttributes={ props.setAttributes }
					/>
					<BlockEdit { ...props } />
				</>
			);
		}
		if ( props.name === 'core/table' ) {
			return (
				<>
					<TableControls
						className={ props.attributes.className }
						setAttributes={ props.setAttributes }
					/>
					<BlockEdit { ...props } />
				</>
			);
		}
		return <BlockEdit { ...props } />;
	}
);

const listSpacingOptions = [
	{ label: 'Regular spaced', value: '' },
	{ label: 'Medium spaced', value: 'medium-spaced' },
	{ label: 'Large Spaced', value: 'spaced' },
];
const unstyledClass = 'is-style-unstyled';

function UnorderedListSettings( { className, setAttributes } ) {
	const isUnstyled = hasClass( className, unstyledClass );
	return (
		<InspectorControls>
			<PanelBody title="Unordered list settings">
				<ToggleControl
					label="Unstyled"
					checked={ isUnstyled }
					onChange={ () => {
						setAttributes( {
							className: toggleClass( className, unstyledClass ),
						} );
					} }
				/>
			</PanelBody>
		</InspectorControls>
	);
}

function ListControls( { className, ordered, setAttributes } ) {
	const isFirstRender = useRef( true );
	// When switching between ordered and unordered make sure we remove classes
	// of the other list type
	useEffect( () => {
		if ( isFirstRender.current ) {
			isFirstRender.current = false;
			return;
		}
		if ( ordered ) {
			const newClass = replaceClasses( className, [ unstyledClass ], '' );
			if ( newClass !== className ) {
				setAttributes( { className: newClass } );
			}
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
			{ ! ordered && (
				<UnorderedListSettings { ...{ className, setAttributes } } />
			) }
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

function TableControls( { className, setAttributes } ) {
	const isCompact = hasClass( className, 'compact' );
	return (
		<InspectorControls>
			<PanelBody title="Formatting">
				<ToggleControl
					label="Compact"
					checked={ isCompact }
					onChange={ () => {
						setAttributes( {
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
 * Add variations for all our callouts
 *
 * Note: isActive and modifyGroupIsActive() are commented out. They allow
 * WordPress to know the callout variation, and so display the name and icon in
 * the toolbar and document overview. For now this wasn't determined to be
 * needed, but can be added back if needed.
 */
addCalloutVariation( 'alert', 'Alert' );
addCalloutVariation( 'info', 'Information' );
addCalloutVariation( 'note', 'Note' );
addCalloutVariation( 'tip', 'Tip' );
addCalloutVariation( 'warning', 'Warning' );

function addCalloutVariation( id, title ) {
	registerBlockVariation( 'core/group', {
		name: `callout-${ id }`,
		title: `${ title } Callout`,
		description: 'Draw attention to specific information',
		example: {
			innerBlocks: [
				{
					name: 'core/paragraph',
					attributes: {
						content: 'Draw attention to this message!',
					},
				},
			],
		},
		icon: InformationIcon,
		attributes: {
			layout: { type: 'default' },
			className: `callout callout-${ id }`,
		},
		// isActive: ( blockAttributes ) => {
		// 	return (
		// 		blockAttributes.className &&
		// 		hasClass( blockAttributes.className, `callout-${ id }` ) &&
		// 		hasClass( blockAttributes.className, 'callout' )
		// 	);
		// },
		innerBlocks: [ [ 'core/paragraph' ] ],
	} );
}
/**
 * Wrap the isActive function of the core/group group variation as otherwise it
 * will always return true for our callout variations.
 */
// function modifyGroupIsActive() {
// 	const variations = getBlockVariations( 'core/group' );
// 	for ( let i = 0; i < variations.length; i++ ) {
// 		if ( variations[ i ].name !== 'group' ) continue;
// 		const wrappedIsActive = variations[ i ].isActive;
// 		variations[ i ].isActive = ( blockAttributes, variationAttributes ) => {
// 			if (
// 				blockAttributes.className &&
// 				hasClass(
// 					blockAttributes.className,
// 					'callout-(alert|info|tip|note|warning)'
// 				) &&
// 				hasClass( blockAttributes.className, 'callout' )
// 			) {
// 				return false;
// 			}
// 			return wrappedIsActive( blockAttributes, variationAttributes );
// 		};
// 		return;
// 	}
// }

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

/**
 * SEMLA Map block - Google map and optional directions. Usually used inside
 * semla/location block
 *
 * TODO: The TextControl should eventually be replaced by NumberControl once
 * that stops being experimental
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	Icon,
	Modal,
	PanelBody,
	TextControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { select, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

import metadata from './block.json';
import icon from './google-map-icon';
import transforms from './transforms';

const ALLOWED_BLOCKS = [ 'core/image', 'core/paragraph' ];

function Edit( { clientId, attributes, setAttributes, isSelected } ) {
	const { lat: blockLat, long: blockLong, latLong } = attributes;

	// store Lat/Long shown in side panel in state until "Update Map" is hit,
	// that way we don't save half worked on (and possibly invalid) changes in
	// the block
	const [ { lat, long }, setPanelLatAndLong ] = useState( {
		lat: blockLat,
		long: blockLong,
	} );
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const locationBlockId = useSelect(
		( withSelect ) => {
			const parents = withSelect(
				blockEditorStore
			).getBlockParentsByBlockName( clientId, 'semla/location' );
			if ( parents.length !== 0 ) {
				return parents[ 0 ];
			}
			return null;
		},
		[ clientId ]
	);

	const openMap = () => {
		window.semla = window.semla || {};
		window.semla.loc = {
			lat: blockLat,
			long: blockLong,
			address: locationBlockId
				? select( blockEditorStore ).getBlockAttributes(
						locationBlockId
				  ).address
				: null,
		};
		setIsModalOpen( true );
	};

	// Modal has shouldCloseOnClickOutside false as otherwise it closes if you
	// click on the iframe
	return (
		<div { ...useBlockProps() }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ <Icon icon="location-alt" /> }
						label="Set coordinates on map"
						onClick={ openMap }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title="Help" initialOpen={ false }>
					<p>
						Enter directions below the map so they are hidden when
						the page initially loads. Since 99.9% of people have
						have a SatNav on their phones only add anything if the
						route is complicated, or things like the postcode taking
						people to the wrong place. And if possible add
						information about public transport.
					</p>
				</PanelBody>
				<PanelBody title="Settings">
					<Button variant="secondary" onClick={ openMap }>
						Set coordinates on map
					</Button>
					<p style={ { 'margin-top': '0.25em' } }>
						(the map will start at the current location, or if the
						Map is inside a Location block with an address then it
						will start there)
					</p>
					<p>If you know the exact coordinates enter them below.</p>
					<TextControl
						label="Latitude"
						type="number"
						value={ lat }
						min={ 50 }
						max={ 54 }
						onChange={ ( val ) =>
							setPanelLatAndLong( {
								lat: val,
								long,
							} )
						}
					/>
					<TextControl
						label="Longitude"
						type="number"
						value={ long }
						min={ -6 }
						max={ 2 }
						onChange={ ( val ) =>
							setPanelLatAndLong( {
								lat,
								long: val,
							} )
						}
					/>
					<Button
						variant="secondary"
						disabled={
							isNaN( lat ) ||
							lat === '' ||
							lat < 50 ||
							lat > 54 ||
							isNaN( long ) ||
							long === '' ||
							long < -6 ||
							long > 2
						}
						onClick={ () => {
							const latF = parseFloat( lat );
							const longF = parseFloat( long );
							setAttributes( {
								lat: latF,
								long: longF,
								latLong: encodeLatLong( latF, longF ),
							} );
						} }
					>
						Update Coordinates
					</Button>
					<Button
						variant="secondary"
						onClick={ () => {
							setPanelLatAndLong( {
								lat: blockLat,
								long: blockLong,
							} );
						} }
					>
						Reset
					</Button>
				</PanelBody>
			</InspectorControls>
			{ isModalOpen && (
				<Modal
					onRequestClose={ () => setIsModalOpen( false ) }
					title="Set Location on Map"
					className="semla-map-modal"
					shouldCloseOnClickOutside={ false }
				>
					<iframe
						title="Map"
						id="semla-map-iframe"
						src={ getScriptUrl() + '../../modal/map-dialog.html' }
					/>
					<div role="group" className="semla-map-buttons">
						<Button
							variant="primary"
							onClick={ () => {
								const { lat: newLat, long: newLong } =
									window.semla.loc;
								setAttributes( {
									lat: newLat,
									long: newLong,
									latLong: encodeLatLong( newLat, newLong ),
								} );
								setPanelLatAndLong( {
									lat: newLat,
									long: newLong,
								} );
								setIsModalOpen( false );
							} }
						>
							OK
						</Button>
						<Button
							variant="secondary"
							onClick={ () => setIsModalOpen( false ) }
						>
							Cancel
						</Button>
					</div>
					<p className="semla-map-instructions">
						Drag the marker or double-click to set the exact
						position. You can also use the search box to search for
						a location.
					</p>
				</Modal>
			) }
			<div className="semla-border semla-border-dashed">
				{ locationBlockId === null && isSelected && (
					<p className="no-top-margin">
						<strong>WARNING:</strong> This is a standalone map.
						Transform it to a Location block for a club or venue
						address with a map.
					</p>
				) }
				<button className="acrd-btn">
					Map and Directions (will start hidden on live page)
				</button>
				{ latLong ? (
					<p
						className="semla-border semla-border-dashed"
						style={ {
							'margin-top': '0.5em',
							'padding-bottom': '0.5em',
						} }
					>
						A Google map at { `${ blockLat },${ blockLong }` } will
						be inserted here. Check the preview to see the actual
						rendering, or click &quot;Set coordinates on map&quot;
						in the toolbar or block settings to see the location.
					</p>
				) : (
					<p
						className="semla-border semla-border-dashed"
						style={ {
							'margin-top': '0.5em',
							color: 'red',
							'font-weight': 'bold',
						} }
					>
						NO COORDINATES SET
					</p>
				) }
				<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
			</div>
		</div>
	);
}

function save() {
	return <InnerBlocks.Content />;
}

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save,
	transforms,
} );

/*  --------------- Utility Function ----------------------- */

let scriptUrl = null; // url of this script to load map dialog from
function getScriptUrl() {
	if ( scriptUrl === null ) {
		const mapScript =
			document.currentScript ||
			document.querySelector( 'script[src*="semla/blocks/"]' );
		if ( mapScript ) {
			const src = mapScript.src;
			scriptUrl = src.substring( 0, src.lastIndexOf( '/' ) + 1 );
		}
	}
	return scriptUrl;
}

/* create a url encoded version of lat/long */
function encodeLatLong( lat, long ) {
	if ( lat < 50 || lat > 54 || long < -6 || long > 2 ) {
		return null;
	}
	return lat.toFixed( 6 ) + '%2C' + long.toFixed( 6 );
}

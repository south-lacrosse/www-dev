/**
 * SEMLA Location - includes address, notes, Google map etc.
 * https://github.com/emgk/Blocks-Google-Map/blob/master/src/actions.js
 * https://plugins.trac.wordpress.org/browser/map-block-gutenberg/trunk/js/_source/blocks/index.js
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	PlainText,
	RichText,
} from '@wordpress/block-editor';
import {
	Button,
	ButtonGroup,
	Icon,
	Modal,
	PanelBody,
	TextControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { RawHTML, useState } from '@wordpress/element';
const { omit } = lodash;
import './location.scss';

registerBlockType( 'semla/location', {
	title: 'Location',
	icon: 'location',
	category: 'widgets',
	description:
		'All information about a location - address, notes, map, directions',
	attributes: {
		address: {
			type: 'string',
			source: 'text',
			selector: '.wp-block-semla-location > p:first-child',
		},
		notes: {
			type: 'string',
			source: 'html',
			multiline: 'p',
			selector: '.location__notes',
			default: '',
		},
		lat: {
			type: 'number',
		},
		long: {
			type: 'number',
		},
		latLong: {
			type: 'string',
		},
	},
	supports: {
		customClassName: false,
		className: false,
		html: false,
	},

	// need function name starting with a capital to stop useState complaining
	edit: function LocationEdit( { attributes, setAttributes, isSelected } ) {
		const {
			address,
			notes,
			lat,
			long,
			latLong,
		} = attributes;

		const [ isModalOpen, setIsModalOpen ] = useState( false );
		// Note: modal has shouldCloseOnClickOutside false as otherwise it closes if you
		// click on the iframe (as least in wp 5.3.2)
		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={ <Icon icon="location-alt" /> }
							label="Set location on map"
							onClick={ () => {
								window.semla = window.semla || {};
								window.semla.loc = { address, lat, long };
								setIsModalOpen( true );
							} }
						/>
					</ToolbarGroup>
				</BlockControls>
				<InspectorControls>
					<PanelBody title="Help" initialOpen={ false }>
						<p>
							To display the map either enter the coordinates
							below, or find the exact location on a map using the
							button in the toolbar (the map will start at the
							current location, or if none is set then it will
							start at the address if entered).
						</p>
						<p>
							Put important instructions that should always be
							displayed in the entry field above the map (e.g.
							non-grass pitch types and required footwear,
							non-standard start times), as anything below that
							will be hidden when the page is initially displayed.
						</p>
						<p>
							Enter directions below the map. Since 99.9% of
							people have SatNav on their phones only add anything
							if the route is complicated, or things like the
							postcode taking people to the wrong place. And if
							possible add information about public transport.
						</p>
					</PanelBody>
					<PanelBody title="Map">
						<p>
							If you know the exact coordinates enter them below,
							and click the &quot;Update Map&quot; button to
							update the map.
						</p>
						<TextControl
							label="Latitude"
							type="number"
							value={ lat }
							min={ 50 }
							max={ 54 }
							onChange={ ( val ) =>
								setAttributes( { lat: parseFloat( val ) } )
							}
						/>
						<TextControl
							label="Longitude"
							type="number"
							value={ long }
							min={ -6 }
							max={ 2 }
							onChange={ ( val ) =>
								setAttributes( { long: parseFloat( val ) } )
							}
						/>
						<Button
							isSecondary
							onClick={ () => {
								setAttributes( {
									latLong: encodeLatLong( lat, long ),
								} );
							} }
						>
							Update Map
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
						<p>
							Drag the marker or double-click to set the exact
							position. You can also use the search box to search
							for a location.
						</p>
						<iframe
							title="Map"
							id="semla-map-iframe"
							src={ getScriptUrl() + '../modal/map-dialog.html' }
						/>
						<ButtonGroup className="semla-map-buttons">
							<Button
								isPrimary
								onClick={ () => {
									setAttributes( {
										lat: window.semla.loc.lat,
										long: window.semla.loc.long,
										latLong: encodeLatLong(
											window.semla.loc.lat,
											window.semla.loc.long
										),
									} );
									setIsModalOpen( false );
								} }
							>
								OK
							</Button>
							<Button
								isDefault
								onClick={ () => setIsModalOpen( false ) }
							>
								Cancel
							</Button>
						</ButtonGroup>
					</Modal>
				) }
				<PlainText
					label="Address"
					value={ address }
					placeholder="Address"
					onChange={ ( val ) => {
						setAttributes( { address: val } );
					} }
				/>
				{ ( ! isMultilineRichTextEmpty( notes ) || isSelected ) && (
					<RichText
						label="Notes"
						value={ notes }
						multiline
						placeholder="Important notes, including pitch type if non-grass..."
						onChange={ ( val ) => setAttributes( { notes: val } ) }
					/>
				) }
				<div className="semla__border semla__border_dashed">
					<button className="acrd-btn">
						Map and Directions (will start hidden on live page)
					</button>
					{ latLong && (
						<iframe
							className="gmap"
							src={
								'https://www.google.com/maps/embed/v1/place?q=' +
								latLong +
								'&zoom=15&key=' +
								window.semla.gapi
							}
							title="Google Map"
							allowFullScreen
						></iframe>
					) }
					<InnerBlocks
						allowedBlocks={ [ 'core/image', 'core/paragraph' ] }
					/>
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const { notes, latLong, londonPostcode } = attributes;
		return (
			<div className="wp-block-semla-location">
				<p>{ attributes.address }</p>
				{ ! isMultilineRichTextEmpty( notes ) && (
					<RichText.Content
						tagName="div"
						className="location__notes"
						value={ notes }
						multiline
					/>
				) }
				<button
					className="acrd-btn"
					data-toggle="collapse"
					aria-expanded="false"
				>
					Map and Directions
				</button>
				<div className="acrd-content">
					{ latLong && <RawHTML>!MAP!</RawHTML> }
					{ ! latLong && <p>Map coordinates not set!</p> }
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},

	deprecated: [
		{
			attributes: {
				address: {
					type: 'string',
					source: 'text',
					selector: '.wp-block-semla-location > p:first-child',
				},
				londonPostcode: {
					type: 'string',
					default: null,
				},
				notes: {
					type: 'string',
					source: 'html',
					multiline: 'p',
					selector: '.location__notes',
					default: '',
				},
				lat: {
					type: 'number',
				},
				long: {
					type: 'number',
				},
				latLong: {
					type: 'string',
				},
			},
			
			migrate( attributes ) {
                return omit( attributes, 'londonPostcode' );
            },
 
   			save( { attributes } ) {
				const { notes, latLong, londonPostcode } = attributes;
				return (
					<div className="wp-block-semla-location">
						<p>{ attributes.address }</p>
						{ ! isMultilineRichTextEmpty( notes ) && (
							<RichText.Content
								tagName="div"
								className="location__notes"
								value={ notes }
								multiline
							/>
						) }
						<button
							className="acrd-btn"
							data-toggle="collapse"
							aria-expanded="false"
						>
							Map and Directions
						</button>
						<div className="acrd-content">
							{ latLong && <RawHTML>!MAP!</RawHTML> }
							{ ! latLong && <p>Map coordinates not set!</p> }
							{ londonPostcode && (
								<p className="no-print">
									<a
										href={
											'https://tfl.gov.uk/plan-a-journey/?to=' +
											londonPostcode
										}
										rel="nofollow"
									>
										Plan a journey using Transport For London
									</a>
								</p>
							) }
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		}
	]
} );

let scriptUrl = null; // url of this script to load map dialog from
function getScriptUrl() {
	if ( scriptUrl === null ) {
		const mapScript =
			document.currentScript ||
			document.querySelector( 'script[src*="semla/blocks"]' );
		if ( mapScript ) {
			const src = mapScript.src;
			scriptUrl = src.substring( 0, src.lastIndexOf( '/' ) + 1 );
		}
	}
	return scriptUrl;
}

function isMultilineRichTextEmpty( attr ) {
	return ! attr || attr.length === 0 || attr === '<p></p>';
}

/* create a url encoded version of lat/long */
function encodeLatLong( lat, long ) {
	if (
		isNaN( lat ) ||
		isNaN( long ) ||
		lat < 50 ||
		lat > 54 ||
		long < -6 ||
		long > 2
	) {
		return null;
	}
	return lat.toFixed( 6 ) + '%2C' + long.toFixed( 6 );
}

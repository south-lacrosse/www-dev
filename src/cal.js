/**
 * Gutenberg block to embed a Google Calendar
 */
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import {
	Icon,
	ColorPicker,
	PanelBody,
	Placeholder,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './cal.scss';

registerBlockType( 'semla/calendar', {
	title: 'Google Calendar',
	icon: 'calendar-alt',
	category: 'embed',
	description: 'Embed a Google Calendar',
	attributes: {
		cid: {
			type: 'string',
		},
		enhanced: {
			type: 'boolean',
			default: false,
		},
		tagsList: {
			type: 'array',
			default: [],
		},
	},
	supports: {
		html: false,
		multiple: false,
	},

	edit( { attributes, setAttributes } ) {
		const { enhanced, tagsList } = attributes;

		const updateTagsList = ( offset, val ) => {
			// clone the tagsList - we need to completely replace them
			const newtagsList = tagsList.map( ( a ) => ( { ...a } ) );
			newtagsList[ offset ] = Object.assign( newtagsList[ offset ], val );
			setAttributes( { tagsList: newtagsList } );
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title="Calendar Type">
						<ToggleControl
							checked={ enhanced }
							label="Enhanced"
							onChange={ () => {
								if ( enhanced ) {
									setAttributes( {
										enhanced: false,
										tagsList: [],
									} );
								} else {
									setAttributes( {
										enhanced: ! enhanced,
									} );
								}
							} }
						/>
						<p>
							<b>Default</b> simply lists the events, split by
							month, with day name, day, start time, end date (if
							different) and time, and summary.
						</p>
						<p>
							<b>Enhanced</b> does the same, but additionally adds
							location, and extracts a URL from the description to
							use as a link (anything like
							&quot;http://x.com&quot;). It also adds adds
							coloured tags if you have &apos; : &apos; in the
							summary, so &apos;SBL Session 5 : Box&apos; will
							have Box as the tag, and you can specify colours for
							the tags (default blue) under Tags below.
						</p>
					</PanelBody>
					{ enhanced && (
						<>
							<PanelBody title="Tags">
								<p>
									You can specify the colour of the tags
									(after the &apos;:&apos; in the summary).
									Note that if no colour is specified then
									blue (#0277bd) is used.
								</p>
								<RangeControl
									label="Number of Tags"
									value={ tagsList.length }
									onChange={ ( columns ) => {
										let newtagsList;
										if ( columns < tagsList.length ) {
											newtagsList = tagsList
												.slice( 0, columns )
												.map( ( a ) => ( {
													...a,
												} ) );
										} else {
											newtagsList = tagsList.map(
												( a ) => ( { ...a } )
											);
											while (
												newtagsList.length < columns
											) {
												newtagsList.push( {
													tag: '',
													color: '#000000',
												} );
											}
										}
										setAttributes( {
											tagsList: newtagsList,
										} );
									} }
									min={ 0 }
									max={ 10 }
								/>
							</PanelBody>
							{ tagsList.map( ( element, index ) => {
								const { tag, color } = element;
								let title = 'Tag ' + ( index + 1 );
								if ( tag ) {
									title += ' ' + tag;
								}
								return (
									<PanelBody
										key={ index }
										title={ title }
										initialOpen={ false }
									>
										<TextControl
											label="Tag"
											placeholder="Tag"
											onChange={ ( val ) =>
												updateTagsList( index, {
													tag: val,
												} )
											}
											value={ tag }
										/>
										<ColorPicker
											color={ color }
											onChangeComplete={ ( val ) =>
												updateTagsList( index, {
													color: val.hex,
												} )
											}
											disableAlpha
										/>
									</PanelBody>
								);
							} ) }
						</>
					) }
				</InspectorControls>
				<Placeholder
					icon={ <Icon icon="calendar-alt" /> }
					label="Embed a Google Calendar"
					instructions="Enter the Google Calendar Id"
				>
					<div className="components-placeholder__fieldset">
						<input
							className="semla-cal-placeholder__text-input-field"
							type="text"
							value={ attributes.cid }
							aria-label="Google Calendar id"
							placeholder="calendar@group.calendar.google.com"
							onChange={ ( event ) =>
								setAttributes( { cid: event.target.value } )
							}
						/>
					</div>
					<p className="components-placeholder__learn-more">
						Open the Settings to set calendar options. Open the page
						or preview to see the actual calendar.
					</p>
				</Placeholder>
			</>
		);
	},

	save() {
		// render server side
		return null;
	},
} );

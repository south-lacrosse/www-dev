/**
 * Gutenberg block for contact
 */
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import {
	PanelBody,
	Placeholder,
	TextControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { edit as editIcon, formatIndent } from '@wordpress/icons';

import metadata from './block.json';
import transforms from './transforms';
import { formatTel } from './utils';

function Edit( { attributes, setAttributes, isSelected } ) {
	const { sameLine } = attributes;
	const blockProps = useBlockProps( {
		className: sameLine ? 'avf-same-line' : '',
	} );

	// Contact must have a role, and email or telephone. We keep it in edit mode
	// if there's a role & name so that the user is prompted that there must
	// actually be contact info.
	const isBlockIncomplete =
		! attributes.role || ( ! attributes.email && ! attributes.tel );

	// when the block is selected it can be in preview or edit mode
	const [ isEdit, setIsEdit ] = useState( isBlockIncomplete );

	// if the block is incomplete then put it into edit mode, so this also runs
	// when a new block is created
	if ( isBlockIncomplete && ! isEdit ) {
		setIsEdit( true );
	}

	// copy of attributes to use in the form. The actual attributes will be
	// a trimmed/formatted version of these.
	const [ formAttributes, setFormAttributes ] = useState( { ...attributes } );
	// Update formAttributes to hold the input fields, and also update the
	// attributes to format the telephone and trim any others
	const onChange = function ( updatedAttrs ) {
		setFormAttributes( {
			...formAttributes,
			...updatedAttrs,
		} );
		const attrs = {};
		for ( const name in updatedAttrs ) {
			const value = '' + updatedAttrs[ name ];
			if ( name === 'tel' ) {
				attrs[ name ] = formatTel( value );
			} else if ( name === 'email' ) {
				attrs[ name ] = value.replaceAll( ' ', '' );
			} else {
				attrs[ name ] = value.trim().replace( /  +/g, ' ' );
			}
		}
		setAttributes( attrs );
	};

	// InspectorControls to update the role/name etc. are only added if
	// isSelected as otherwise a user can select multiple contacts in the
	// Overview and then they can change all roles/names from the Settings.
	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					{ isSelected && ! isBlockIncomplete && (
						<ToolbarButton
							label="Edit mode"
							icon={ editIcon }
							isActive={ isEdit }
							onClick={ () => setIsEdit( ( state ) => ! state ) }
						/>
					) }
					<ToolbarButton
						icon={ formatIndent }
						label="Put contact details on line below role"
						isActive={ ! sameLine }
						onClick={ () =>
							setAttributes( { sameLine: ! sameLine } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			{ isSelected && (
				<InspectorControls>
					<PanelBody title="Settings" initialOpen={ true }>
						<ContactForm
							attributes={ formAttributes }
							onChange={ onChange }
						/>
					</PanelBody>
				</InspectorControls>
			) }
			<div { ...blockProps }>
				{ isBlockIncomplete || ( isEdit && isSelected ) ? (
					<Placeholder
						icon="admin-users"
						label="Contact"
						isColumnLayout
					>
						<ContactForm
							attributes={ formAttributes }
							onChange={ onChange }
						/>
					</Placeholder>
				) : (
					<Contact attributes={ attributes } />
				) }
			</div>
		</>
	);
}

function Contact( { attributes } ) {
	const { role, name, email, tel } = attributes;

	const style = { 'pointer-events': 'none' };
	return (
		<>
			<div className="avf-name">{ role }</div>
			<div className="avf-value">
				{ name }
				{ email && name && <br /> }
				{ email && (
					<a style={ style } href={ `mailto:${ email }` }>
						{ email }
					</a>
				) }
				{ tel && ( name || email ) && <br /> }
				{ tel && (
					<a
						style={ style }
						href={ `tel:${ tel.replaceAll( ' ', '' ) }` }
					>
						{ tel }
					</a>
				) }
			</div>
		</>
	);
}

// Used in Settings (InspectorControls) and in the main editor in edit mode
function ContactForm( { attributes, onChange } ) {
	const { role, name, email, tel } = attributes;
	return (
		<>
			<TextControl
				label="Role"
				value={ role }
				onChange={ ( val ) => onChange( { role: val } ) }
			/>
			<TextControl
				label="Name"
				value={ name }
				onChange={ ( val ) => onChange( { name: val } ) }
			/>
			<TextControl
				label="Email"
				type="email"
				value={ email }
				onChange={ ( val ) => onChange( { email: val } ) }
			/>
			<TextControl
				label="Telephone"
				type="tel"
				value={ tel }
				onChange={ ( val ) => onChange( { tel: val } ) }
			/>
		</>
	);
}

registerBlockType( metadata.name, { edit: Edit, transforms } );

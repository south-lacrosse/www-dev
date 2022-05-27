/**
 * Gutenberg block for attribute-value field
 */
import { BlockControls, PlainText, RichText } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { formatIndent } from '@wordpress/icons';
import './attr-value.scss';

registerBlockType( 'semla/attr-value', {
	title: 'Attribute/value pair',
	icon: 'feedback',
	category: 'formatting',
	description:
		'An attribute/value pair, e.g. for contacts "Captain: name/email", or "Colours: purple"',
	attributes: {
		attr: {
			type: 'string',
			source: 'text',
			selector: '.avf-name',
		},
		value: {
			type: 'string',
			source: 'html',
			selector: '.avf-value',
		},
		sameLine: {
			type: 'boolean',
			default: true,
		},
	},
	example: {
		attributes: {
			attr: 'Captain',
			value:
				'Fred Blogs<br><a href="mailto:fred@gmail.com">fred@gmail.com</a><br><a href="tel:07555555555">07555 555555</a>',
		},
	},

	edit( { attributes, className, setAttributes, isSelected } ) {
		if ( attributes.sameLine ) className += ' avf-same-line';
		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={ formatIndent }
							label="Put value on line below attribute"
							isActive={ ! attributes.sameLine }
							onClick={ () => {
								setAttributes( {
									sameLine: ! attributes.sameLine,
								} );
							} }
						/>
					</ToolbarGroup>
				</BlockControls>
				<div className={ className }>
					{ isSelected || ! attributes.sameLine ? (
						<div className="avf-name avf-no-colon">
							<PlainText
								value={ attributes.attr }
								placeholder="Attribute"
								onChange={ ( val ) =>
									setAttributes( { attr: val } )
								}
							/>
						</div>
					) : (
						<div className="avf-name">{ attributes.attr }</div>
					) }
					<RichText
						tagName="div"
						className="avf-value"
						value={ attributes.value }
						placeholder="Value"
						onChange={ ( val ) => setAttributes( { value: val } ) }
						// inlineToolbar
					/>
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const className = attributes.sameLine ? 'avf-same-line' : '';
		return (
			<div className={ className }>
				<div className="avf-name">{ attributes.attr }</div>
				<RichText.Content
					tagName="div"
					className="avf-value"
					value={ attributes.value }
				/>
			</div>
		);
	},
} );

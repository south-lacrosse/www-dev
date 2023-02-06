/**
 * Gutenberg block for adding SEMLA data like tables
 */
import apiFetch from '@wordpress/api-fetch';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { Disabled, Icon, Placeholder, ToolbarGroup,	ToolbarButton,
	} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { edit as editIcon } from '@wordpress/icons';
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';

function Edit( { attributes, setAttributes } ) {
	const [ options, setOptions ] = useState( null );
	useEffect( () => {
		apiFetch( { path: '/semla-admin/v1/leagues-cups' } )
			.then( ( response ) => {
				const competitionOptions = [];
				for ( let i = 0, len = response.length; i < len; i++ ) {
					const { id, type, name } = response[ i ];
					if ( type === 'league' ) {
						competitionOptions.push(
							<option
								key={ `curr_tables,${ id }` }
								value={ `curr_tables,${ id }` }
							>
								{ name } League Tables
							</option>
						);
						competitionOptions.push(
							<option
								key={ `curr_grid,${ id }` }
								value={ `curr_grid,${ id }` }
							>
								{ name } Fixtures Grid
							</option>
						);
					} else {
						competitionOptions.push(
							<option
								key={ `curr_flags,${ id }` }
								value={ `curr_flags,${ id }` }
							>
								{ name }
							</option>
						);
						competitionOptions.push(
							<option
								key={ `curr_flags_rounds,${ id }` }
								value={ `curr_flags_rounds,${ id }` }
							>
								{ name } Table
							</option>
						);
					}
				}
				setOptions( competitionOptions );
			} )
			.catch( ( err ) => console.log( err ) );
	}, [] );

	const { src } = attributes;
	if ( 'none' === src ) {
		return (
			<div {...useBlockProps()}>
				<Placeholder
					icon={ <Icon icon="editor-table" /> }
					label="SEMLA Data"
					instructions="Select the data source"
				>
					<select
						className="semla__select"
						onChange={ ( event ) => {
							setAttributes( { src: event.target.value } );
							event.preventDefault();
						} }
					>
						<option value="none">Select...</option>
						<option value="clubs_list">Clubs List</option>
						<option value="clubs_map">Clubs Map</option>
						<option value="curr_fixtures">Fixtures</option>
						{ options }
						<option value="curr_results">
							Recent Results/Upcoming Fixtures
						</option>
					</select>
				</Placeholder>
			</div>
		);
	}
	const noPreview = src === 'clubs_map' || src === 'curr_fixtures';
	return (
		<div {...useBlockProps()}>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label="Change data source"
						icon={ editIcon }
						onClick={ () => {
							setAttributes( { src: 'none' } );
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
			{ noPreview ? (
				<p className="semla__border semla__border_dashed">
					{ src === 'clubs_map' ? 'Clubs map ' : 'Fixtures' } will
					be inserted here - check the preview to see actual
					rendering.
				</p>
			) : (
				<Disabled>
					<ServerSideRender
						block="semla/data"
						attributes={ attributes }
					/>
				</Disabled>
			) }
		</div>
	);
}

registerBlockType( metadata.name, { edit: Edit } );

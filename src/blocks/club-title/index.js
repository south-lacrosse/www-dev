/**
 * Block for club title. Logo goes on left (from featured image), right is page
 * heading text which can include:
 * - post-title block to show club name
 * - website
 * - social links block
 * - other info in paragraphs
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { title as icon } from '@wordpress/icons';

import metadata from './block.json';

const TEMPLATE = [ [ 'core/post-title', { level: 1 } ], [ 'semla/website' ] ];

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/post-title',
	'core/social-links',
	'semla/website',
];

function Edit( { context: { postId, postType } } ) {
	// also returns setFeaturedImage, but we don't use that here
	const [ featuredImage ] = useEntityProp(
		'postType',
		postType,
		'featured_media',
		postId
	);
	const featuredImageURL = useSelect(
		( select ) => {
			if ( featuredImage === 0 ) return null;
			const media = select( coreStore ).getMedia( featuredImage );
			return (
				media?.media_details?.sizes?.thumbnail?.source_url ||
				media?.source_url
			);
		},
		[ featuredImage ]
	);

	return (
		<div { ...useBlockProps() }>
			{ featuredImageURL ? (
				<div className="club-icon">
					<img
						className="club-icon-img"
						src={ featuredImageURL }
						alt=""
					/>
				</div>
			) : (
				<div className="club-icon semla-club-icon-empty">
					Featured image will appear here
				</div>
			) }
			<div className="club-title-content">
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
				/>
			</div>
		</div>
	);
}

function save() {
	return <InnerBlocks.Content />;
}

registerBlockType( metadata.name, { icon, edit: Edit, save } );

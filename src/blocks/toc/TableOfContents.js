import { select, subscribe } from '@wordpress/data';
import { Component, RawHTML } from '@wordpress/element';

export default class TableOfContents extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			value: props.value,
			unsubscribe: null,
		};
	}

	setToc() {
		const toc = [];
		const filteredBlocks = select( 'core/block-editor' )
			.getBlocks()
			.filter(
				( block ) =>
					block.name === 'core/heading' ||
					block.name === 'core/columns'
			);

		filteredBlocks.forEach( ( block ) => {
			if ( block.name === 'core/columns' ) {
				this.getHeadingBlocksFromColumns( block, toc );
			} else {
				this.addToToc( block, toc );
			}
		} );

		const value = toc.length === 0 ? '' : this.createHtml( toc );
		this.setState( { value } );
	}

	getHeadingBlocksFromColumns( block, toc ) {
		if ( block.name === 'core/columns' || block.name === 'core/column' ) {
			block.innerBlocks.forEach( ( bl ) => {
				this.getHeadingBlocksFromColumns( bl, toc );
			} );
		} else if ( block.name === 'core/heading' ) {
			this.addToToc( block, toc );
		}
	}

	// Find correct place to insert heading into Table of Contents
	addToToc( block, toc ) {
		let attributes = block.attributes;

		if ( ! attributes.content ) {
			return;
		}
		// if a heading has no anchor then make sure we add one
		if ( ! attributes.anchor || attributes.anchor.startsWith( 'st-' ) ) {
			attributes.anchor =
				'st-' +
				attributes.content
					.toString()
					.replace( /( |<br>)/g, '-' )
					.replace( /[^\w\s-]/g, '' );
		}
		// need to copy to new object as we'll be adding children
		attributes = {
			level: attributes.level,
			content: attributes.content,
			anchor: attributes.anchor,
		};

		if ( toc.length === 0 ) {
			toc.push( attributes );
			return;
		}

		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			// look at last item in current level in table of contents
			const last = toc[ toc.length - 1 ];
			if ( attributes.level <= last.level ) {
				toc.push( attributes );
				return;
			}
			// needs to go in child level - let's see if that exists yet
			if ( ! last.children ) {
				// nope - so create children array
				last.children = [ attributes ];
				return;
			}
			// look next level down
			toc = last.children;
		}
	}

	createHtml( list ) {
		let items = '';
		list.forEach( ( item ) => {
			items += `<li><a href="#${ item.anchor }">${ item.content }</a>`;
			if ( item.children ) {
				items += '<ul>' + this.createHtml( item.children ) + '</ul>';
			}
			items += '</li>';
		} );
		return items;
	}

	componentDidMount() {
		this.setToc();
		const unsubscribe = subscribe( () => {
			this.setToc();
		} );
		this.setState( { unsubscribe } );
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.props.onChange && this.state.value !== prevState.value ) {
			this.props.onChange( this.state.value );
		}
	}

	static Content( props ) {
		// note: <ul> is inside RawHTML as in editor RawHTML will include <div>, so we
		// need to make sure the div is outside the ul (removes when serialising)
		return (
			<RawHTML>
				{ '<ul id="semla_toc-list">' + props.value + '</ul>' }
			</RawHTML>
		);
	}

	render() {
		if ( this.state.value ) {
			return TableOfContents.Content( this.state );
		}
		return (
			<p className="semla__filler">
				Add a header to begin generating the table of contents
			</p>
		);
	}
}

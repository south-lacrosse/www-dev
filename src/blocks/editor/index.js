/**
 * Editor specific customisation
 */
import { external } from '@wordpress/icons';
import { PluginMoreMenuItem } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Add an item to the Options menu (3 vertical dots) under Plugins
 */
registerPlugin( 'semla-help', {
	render: () => (
		<PluginMoreMenuItem
			icon={ external }
			href="https://south-lacrosse.github.io/wp-help/"
			target="_blank"
			rel="noopener noreferrer"
		>
			SEMLA Help
		</PluginMoreMenuItem>
	),
} );

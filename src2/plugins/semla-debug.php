<?php
/**
 * Plugin Name:       SEMLA Debug
 * Plugin URI:        https://www.southlacrosse.org.uk/
 * Description:       Useful debug WP-CLI commands
 * Version:           1.0.0
 * Author:            SEMLA
 * Author URI:        mailto:webmaster@southlacrosse.org.uk
 * License:           GNU General Public License v2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.html
 */

defined('WPINC') || die;

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	/**
	 * Useful debugging tools
	 */
	class Semla_Debug {

		/**
		 * List functions called by a filter or hook
		 * 
		 * ## OPTIONS
		 * 
		 * <hook or filter>
		 */
		public function filter( $args, $assoc_args ) {
			global $wp_filter;
			if (empty( $wp_filter[$args[0]] )) WP_CLI::error('Filter does not exist.');
			foreach ($wp_filter[$args[0]]->callbacks as $priority => $functions) {
				foreach ($functions as $function_key => $function) {
					WP_CLI::log("$function_key ($priority)");
				}
			}
		}
	}

	WP_CLI::add_command( 'debug', 'Semla_Debug' );
};

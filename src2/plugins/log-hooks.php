<?php
/**
 * Plugin Name:       log-hooks
 * Description:       Log all hooks used in each request
 * Version:           1.0.0
 * Author:            SEMLA
 * Author URI:        mailto:webmaster@southlacrosse.org.uk
 * License:           MIT
 * License URI:       https://opensource.org/licenses/mit-license.html
 */

/**
 * This must-use plugin (i.e. should be copied to wp-content/plugins/must-use)
 * will log all the WordPress calls to do_action (i.e. hooks) for each request.
 * Useful for seeing which hook to add code to.
 * 
 * Note: The Query Monitor plugin will display hooks/actions used for regular pages,
 * this is useful for REST interactions
 * 
 * IMPORTANT: make sure you remove this from mu-plugins after you're done
 */
add_action ( 'shutdown', function(){
    error_log(print_r ( $GLOBALS['wp_actions'], true ));
} );
// add_action( 'all', function ( $tag ) {
//     static $hooks = array();
//     // Only do_action / do_action_ref_array hooks.
//     if ( did_action( $tag ) ) {
//         $hooks[] = $tag;
//     }
//     if ( 'shutdown' === $tag ) {
//         error_log(print_r( $hooks, true ));
//     }
// } );
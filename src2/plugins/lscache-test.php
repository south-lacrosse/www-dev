<?php
/**
 * Plugin Name:       lscache-test
 * Description:       Log all Litespeed cache interactions (at least the ones we use)
 * Version:           1.0.0
 * Author:            SEMLA
 * Author URI:        mailto:webmaster@southlacrosse.org.uk
 * License:           MIT
 * License URI:       https://opensource.org/licenses/mit-license.html
 */

 /* Useful little plugin to test Litespeed cache. When activated it will log
    any interactions with litespeed so we can debug before moving to a staging
    server to test */
    
// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}
if ( ! defined( 'LSCWP_V' ) ) define('LSCWP_V','1.0');

add_action('litespeed_purge', function($args) {
    lscashe_test_log('litespeed_purge', $args);
});
add_action('litespeed_purge_all_object', function($args) {
    lscashe_test_log('litespeed_purge_all_object', $args);
});
add_action('litespeed_purge_url', function($args) {
    lscashe_test_log('litespeed_purge_url', $args);
});
add_action('litespeed_purge_posttype', function($args) {
    lscashe_test_log('litespeed_purge_posttype', $args);
});

add_action('litespeed_tag_add', function($args) {
    lscashe_test_log('litespeed_tag_add', $args);
});

add_action('litespeed_control_set_nocache', function($args) {
    lscashe_test_log('litespeed_control_set_nocache', $args);
});
add_action('litespeed_control_set_ttl', function($args) {
    lscashe_test_log('litespeed_control_set_ttl', $args);
});

add_action('shutdown', function() {
    do_action('litespeed_tag_finalize');
});

function lscashe_test_log($func, $args) {
    if ( is_array( $args ) ) {
        $args = implode(',',$args);
    }
    error_log("$func, args: $args - uri ". $_SERVER['REQUEST_URI']);
}

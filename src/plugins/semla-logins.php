<?php
/**
 * Plugin Name:       SEMLA Log Users
 * Description:       Log when users login and out
 * Version:           1.0.0
 * Author:            SEMLA
 * Author URI:        mailto:webmaster@southlacrosse.org.uk
 * License:           MIT
 * License URI:       https://opensource.org/licenses/mit-license.html
*/
add_action( 'wp_login',  function ( $user_login, $user ) {
    semla_logins_log("login $user->ID,$user_login,$user->user_email");
}, 10, 2 );

add_action( 'wp_logout',  function ( $user_id  ) {
	semla_logins_log("logout $user_id");
} );

function semla_logins_log($message) {
	@file_put_contents(__DIR__ . '/logins.log', date('[d-M-Y G:i:s e] ')
        . "$message\n"
        , FILE_APPEND | LOCK_EX);
}

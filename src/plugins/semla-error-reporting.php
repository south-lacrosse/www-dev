<?php
/**
 * Plugin Name:       SEMLA Error Reporting
 * Description:       Set PHP error_reporting at first possible point after WordPress has set it
 * Version:           1.0.0
 * Author:            SEMLA
 * Author URI:        mailto:webmaster@southlacrosse.org.uk
 * License:           MIT
 * License URI:       https://opensource.org/licenses/mit-license.html
 */

//  Override the WordPress settings for error_reporting.

//  This is especially useful if WP_DEBUG is set to true as WP sets error_reporting
//  to E_ALL, so we can ignore those here, e.g. if WP isn't yet compatible with a
//  very recent version of PHP you'll normally see many deprecated errors. They're
//  useful the first time, but not so much after that.

// Ignore deprecated - add in other restrictions if needed
error_reporting( E_ALL ^ E_DEPRECATED );

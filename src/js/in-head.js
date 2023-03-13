/**
 * Javascript which should be copied into the <head> section of the website
 * (i.e. in header.php). It is split out here so the code can be worked on, then
 * minified.
 *
 * To minify run "npm run in-head-js" from the command line.
 *
 * Note: this is a manual process, as it really isn't worth automating :) So if
 * you change this file then you need to minify, and copy in-head.min.js into
 * header.php
 */
var d = document.documentElement;
if ( 'addEventListener' in window ) {
	d.className = 'js';
}
if ( typeof SVGRect !== 'undefined' ) {
	d.className += ' svg';
}

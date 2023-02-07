/* eslint-disable no-var */
/* global google, top */

( function () {
	'use strict';

	var map, marker;
	var geocoder = null;

	var GEOCODER_STATUS_DESCRIPTION = {
		UNKNOWN_ERROR:
			'The request could not be successfully processed, yet the ' +
			'exact reason for the failure is not known',
		OVER_QUERY_LIMIT:
			'The webpage has gone over the requests limit in too ' +
			'short a time',
		REQUEST_DENIED:
			'The webpage is not allowed to use the geocoder for some ' +
			'reason',
		INVALID_REQUEST: 'This request was invalid',
		ZERO_RESULTS: 'The address is unknown, please try another',
		ERROR: 'There was a problem contacting the Google servers',
	};

	function initMap() {
		// get the current lat/long (if any) from the main window
		var lat = top.semla.loc.lat;
		var long = top.semla.loc.long;
		var address = top.semla.loc.address;
		var geocodeAddress = false;
		if (
			isNaN( lat ) ||
			isNaN( long ) ||
			lat < 50 ||
			lat > 54 ||
			long < -6 ||
			long > 2
		) {
			top.semla.loc.lat = lat = 51.501476;
			top.semla.loc.long = long = -0.140634;
			geocodeAddress = true;
		}
		var latLng = new google.maps.LatLng( lat, long );

		map = new google.maps.Map( document.getElementById( 'map' ), {
			center: latLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
			disableDoubleClickZoom: true,
			zoomControlOptions: true,
			streetViewControl: false,
			zoom: 16,
		} );

		marker = new google.maps.Marker( {
			position: latLng,
			map,
			title: 'Drag this marker to the exact location',
			draggable: true,
		} );

		if ( geocodeAddress && address ) {
			geocode( address );
		}
		map.addListener( 'dblclick', function ( event ) {
			marker.setPosition( event.latLng );
		} );
		marker.addListener( 'position_changed', function () {
			var position = marker.getPosition();
			top.semla.loc.lat = parseFloat( position.lat().toFixed( 6 ) );
			top.semla.loc.long = parseFloat( position.lng().toFixed( 6 ) );
		} );

		var searchBox = document.getElementById( 'searchBox' );
		map.controls[ google.maps.ControlPosition.TOP_RIGHT ].push( searchBox );

		var autocomplete = new google.maps.places.Autocomplete( searchBox, {
			bounds: new google.maps.LatLngBounds(
				new google.maps.LatLng( 50, -6 ), //sw
				new google.maps.LatLng( 54, 2 ) //ne
			),
			componentRestrictions: { country: 'gb' },
		} );
		autocomplete.addListener( 'place_changed', function () {
			var place = this.getPlace();
			if ( ! place.geometry ) {
				if ( place.name.trim() === '' ) {
					return;
				}
				geocode( place.name.trim() );
				return;
			}
			map.setCenter( place.geometry.location );
			marker.setPosition( place.geometry.location );
		} );
	}

	function geocode( address ) {
		if ( ! geocoder ) {
			geocoder = new google.maps.Geocoder();
		}
		geocoder.geocode( { address }, geocoderResponse );
	}

	function geocoderResponse( results, status ) {
		if ( status === google.maps.GeocoderStatus.OK ) {
			map.setCenter( results[ 0 ].geometry.location );
			marker.setPosition( results[ 0 ].geometry.location );
		} else {
			// eslint-disable-next-line no-console
			console.log( GEOCODER_STATUS_DESCRIPTION[ status ] );
		}
	}

	window.addEventListener( 'load', initMap );
} )();

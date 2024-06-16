/* global google, top */

( function () {
	'use strict';

	let map,
		marker,
		geocoder = null;

	const GEOCODER_STATUS_DESCRIPTION = {
		UNKNOWN_ERROR:
			'The request could not be successfully processed, yet the exact reason is unknown',
		OVER_QUERY_LIMIT: 'The webpage has gone over the requests limit in too short a time',
		REQUEST_DENIED: 'The webpage is not allowed to use the geocoder',
		INVALID_REQUEST: 'This request was invalid',
		ZERO_RESULTS: 'The address is unknown, please try another',
		ERROR: 'There was a problem contacting the Google servers',
	};

	async function initMap() {
		// https://developers.google.com/maps/documentation/javascript/reference
		const { Map } = await google.maps.importLibrary( 'maps' );
		const { ControlPosition, LatLng, LatLngBounds } =
			await google.maps.importLibrary( 'core' );
		const { Autocomplete } = await google.maps.importLibrary( 'places' );
		const { AdvancedMarkerElement } = await google.maps.importLibrary(
			'marker'
		);
		// get the current lat/long (if any) from the main window
		let { lat, long, address } = top.semla.loc;
		let geocodeAddress = false;
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
		const latLng = new LatLng( lat, long );

		map = new Map( document.getElementById( 'map' ), {
			mapId: window.location.host.startsWith( 'dev' )
				? 'DEMO_MAP_ID'
				: 'aa0da5808b17b345',
			center: latLng,
			mapTypeControl: true,
			disableDoubleClickZoom: true,
			zoomControlOptions: true,
			streetViewControl: false,
			zoom: 16,
		} );

		marker = new AdvancedMarkerElement( {
			map,
			title: 'Drag this marker to the exact location',
			position: latLng,
			gmpDraggable: true,
		} );

		if ( geocodeAddress && address ) {
			geocode( address );
		}
		map.addListener( 'dblclick', function ( event ) {
			marker.position = event.latLng;
			savePosition( marker.position );
		} );
		marker.addListener( 'dragend', () => {
			savePosition( marker.position );
		} );

		const searchBox = document.getElementById( 'searchBox' );
		map.controls[ ControlPosition.TOP_RIGHT ].push( searchBox );

		const autocomplete = new Autocomplete( searchBox, {
			bounds: new LatLngBounds(
				new LatLng( 50, -6 ), //sw
				new LatLng( 54, 2 ) //ne
			),
			componentRestrictions: { country: 'gb' },
		} );
		autocomplete.addListener( 'place_changed', function () {
			const place = this.getPlace();
			if ( ! place.geometry ) {
				if ( place.name.trim() === '' ) {
					return;
				}
				geocode( place.name.trim() );
				return;
			}
			map.setCenter( place.geometry.location );
			marker.position = place.geometry.location;
			savePosition( marker.position );
		} );
	}

	// save marker position to top window so it can be picked up on save
	function savePosition( position ) {
		top.semla.loc.lat = parseFloat( position.lat.toFixed( 6 ) );
		top.semla.loc.long = parseFloat( position.lng.toFixed( 6 ) );
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
			marker.position = results[ 0 ].geometry.location;
			savePosition( marker.position );
		} else {
			// eslint-disable-next-line no-alert, no-undef
			alert( GEOCODER_STATUS_DESCRIPTION[ status ] );
		}
	}

	initMap();
} )();

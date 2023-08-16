const lat = document.getElementById( 'lat' );
const long = document.getElementById( 'long' );
const addr = document.getElementById( 'addr' );

document.getElementById( 'btn' ).addEventListener( 'click', () => {
	window.semla.loc = {
		lat: parseFloat( lat.value ),
		long: parseFloat( long.value ),
		address: addr.value.trim(),
	};
	const modal = document.createElement( 'div' );
	modal.id = 'modal';
	modal.innerHTML = `
	<iframe title="Map" id="semla-map-iframe"
	src="../../src/blocks/map/map-dialog.html"></iframe></div>
	<button type="button" onclick="onClose()">Close</button>
	<button type="button" onclick="onOK()">OK</button>
</div>`;
	document.body.appendChild( modal );
} );

function onClose() {
	document.getElementById( 'modal' ).remove();
}
// eslint-disable-next-line no-unused-vars
function onOK() {
	onClose();
	// eslint-disable-next-line no-alert, no-undef
	alert( `lat/long is ${ window.semla.loc.lat } ${ window.semla.loc.long }` );
}

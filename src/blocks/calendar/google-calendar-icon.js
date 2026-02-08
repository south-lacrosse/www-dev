import { Path, SVG } from '@wordpress/primitives';

// original viewBox was 0 0 48 48 which has padding of 6 on all sides. Can
// remove with 6 6 36 36, but wordpress/icons have 24x24 images with 16x16
// content
export default (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path fill="#fff" d="M13 13h22v22H13z" />
		<Path
			fill="#1e88e5"
			d="m25.68 20.92 1.008 1.44 1.584-1.152v8.352H30V18.616h-1.44zM22.943 23.745c.625-.574 1.013-1.37 1.013-2.249 0-1.747-1.533-3.168-3.417-3.168-1.602 0-2.972 1.009-3.33 2.453l1.657.421c.165-.664.868-1.146 1.673-1.146.942 0 1.709.646 1.709 1.44 0 .794-.767 1.44-1.709 1.44h-.997v1.728h.997c1.081 0 1.993.751 1.993 1.64 0 .904-.866 1.64-1.931 1.64-.962 0-1.784-.61-1.914-1.418L17 26.802c.262 1.636 1.81 2.87 3.6 2.87 2.007 0 3.64-1.511 3.64-3.368 0-1.023-.504-1.941-1.297-2.559z"
		/>
		<Path fill="#fbc02d" d="M34 42H14l-1-4 1-4h20l1 4z" />
		<Path fill="#4caf50" d="m38 35 4-1V14l-4-1-4 1v20z" />
		<Path
			fill="#1e88e5"
			d="m34 14 1-4-1-4H9a3 3 0 0 0-3 3v25l4 1 4-1V14h20z"
		/>
		<Path fill="#e53935" d="M34 34v8l8-8z" />
		<Path
			fill="#1565c0"
			d="M39 6h-5v8h8V9a3 3 0 0 0-3-3zM9 42h5v-8H6v5a3 3 0 0 0 3 3z"
		/>
	</SVG>
);

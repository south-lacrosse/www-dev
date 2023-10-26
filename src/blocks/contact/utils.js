export function formatTel( tel ) {
	tel = tel.trim();
	// if tel includes a space assume it's already formatted
	if ( tel.includes( ' ' ) ) return tel.replace( /  +/g, ' ' );
	return tel
		.replace( /^\+44(\d{4})(\d{6})$/, '+44 $1 $2' )
		.replace( /^07(\d{3})(\d{6})$/, '07$1 $2' );
}

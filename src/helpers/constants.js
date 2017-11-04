const rootDomain = ( window.devMode ? 'www.wedding.dev' : 'www.weddingpixie.com' );
export const constants = {
	ROOTDOMAIN: rootDomain,
	VALIDROUTES: [
		'',
		'login',
		'editor'
	],
	DATEFORMATS: {
		long: 'dddd, MMMM Do YYYY',
		short: 'MM/DD/YYYY'
	},
	MAPSTYLES: {
		default: [
			{
				featureType: "all",
				stylers: [{ saturation: -80 }]
			},
			{
				featureType: "road.arterial",
				elementType: "geometry",
				stylers: [
					{ hue: "#00ffee" },
					{ saturation: 50 }
				]
			},
			{
				featureType: "poi.business",
				elementType: "labels",
				stylers: [{ visibility: "off" }]
			}
		]
	},
	GOOGLEMAPSKEY: 'AIzaSyCp9Tk_ZUKItrsNRQ32JCEd8jOyx-9Sebg',
	PRICEPLANS: [
		{
			id: 1,
			name: 'Basic',
			price: 49
		}
	],
	TRUSTEDSITES: [
		1,
		9
	]
}

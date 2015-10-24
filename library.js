"use strict";

var http = require( "http" );

var routeMoefou = { };
routeMoefou.onLoad = function ( params, callback )
{
	var router = params.router;
	router.get( "/moefou/*", function ( req, originalRes )
	{
		var path = req.originalUrl.replace( /^\/moefou/, "" );

		//originalRes.redirect( "http://api.moefou.org" + path );

		var options =
		{
			"hostname": "api.moefou.org",
			port: 80,
			path: path,
			method: "GET"
		};

		var proxyReq = http.request( options, function ( res )
		{
			//res.setEncoding( "utf-8" );
			res.on( "data", function ( chunk )
			{
				originalRes.end( chunk );
				//originalRes.send( chunk );
			} );
			res.on( "close", function ( )
			{
				console.log( "Connection closed." );
			} );
		} );
		proxyReq.setTimeout( 10000, function ( )
		{
			originalRes.json( { "error": "Time out" } );
		} );
		proxyReq.end( );
	} );

	router.get( "/moefm/*", function ( req, originalRes )
	{
		var path = req.originalUrl.replace( /^\/moefm/, "" );

		originalRes.redirect( "http://moe.fm" + path );

		//var options =
		//{
		//	"hostname": "moe.fm",
		//	port: 80,
		//	path: path,
		//	method: "GET"
		//};
        //
		//try
		//{
		//	var proxyReq = http.request( options, function ( res )
		//	{
		//		res.setEncoding( "utf-8" );
		//		res.on( "data", function ( chunk )
		//		{
		//			originalRes.send( chunk );
		//		} );
		//		res.on( "close", function ( )
		//		{
		//			console.log( "Connection closed." );
		//		} );
		//	} );
		//	proxyReq.end( );
		//}
		//catch ( err )
		//{
		//	originalRes.send( { "error": err } );
		//}
	} );

	//console.log( "it comes here." );

	//params.router.use( require( "./server/home" ) );
	//params.router.use( require( "./server/client" ) );

	callback( );
};

module.exports = routeMoefou;
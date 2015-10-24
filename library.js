"use strict";

var http = require( "http" );

function proxyVisit( originalRes, hostName, path )
{
	var options =
	{
		"hostname": hostName,
		"port": 80,
		"path": path,
		"method": "GET"
	};

	var proxyReq = http.request( options, function ( res )
	{
		var buffers = "";
		res.on( "data", function ( chunk )
		{
			buffers += chunk;
		} ).on( "end", function( )
		{
			originalRes.send( buffers );
		} );
	} );
	proxyReq.setTimeout( 10000, function ( )
	{
		originalRes.json( { "error": "Time out" } );
	} );
	proxyReq.end( );
}

var routeMoefou = { };
routeMoefou.onLoad = function ( params, callback )
{
	var router = params.router;
	router.get( "/moefou/*", function ( req, res )
	{
		var path = req.originalUrl.replace( /^\/moefou/, "" );
		proxyVisit( res, "api.moefou.org", path );
	} );

	router.get( "/moefm/*", function ( req, res )
	{
		var path = req.originalUrl.replace( /^\/moefm/, "" );
		proxyVisit( res, "moe.fm", path );
	} );

	callback( );
};

module.exports = routeMoefou;
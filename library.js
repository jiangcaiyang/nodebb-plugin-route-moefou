"use strict";

var http = require( "http" );
var fs = require( "fs" );
var express = require( "express" );

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

	// 为了图方便省事儿，让它也代理浏览bugreports.qt.io
	// forum.qt.io以及photobucket.org
	router.get( "/qtbugreports/*", function ( req, res )
	{
		var path = req.originalUrl.replace( /^\/qtbugreports/, "" );
		proxyVisit( res, "bugreports.qt.io", path );
	} );

	router.get( "/qtforum/*", function ( req, res )
	{
		var path = req.originalUrl.replace( /^\/qtforum/, "" );
		proxyVisit( res, "forum.qt.io", path );
	} );

	router.get( "/photobucket/*", function ( req, res )
	{
		var path = req.originalUrl.replace( /^\/photobucket/, "" );
		proxyVisit( res, "s1288.photobucket.com", path );
	} );

	router.get( "/qtcreatorenhancement/*", function ( req, res )
	{
		var realPath = __dirname + "/../../../../QtProject" + req.originalUrl;
		console.log( realPath );
		var questionPos = realPath.indexOf( '?' );
		if ( questionPos != -1 )
		{
			realPath = realPath.substr( 0, questionPos );
		}

		res.download( realPath );
	} );

	callback( );
};

module.exports = routeMoefou;
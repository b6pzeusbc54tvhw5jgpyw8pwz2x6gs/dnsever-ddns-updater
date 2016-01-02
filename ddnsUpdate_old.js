#!/usr/bin/env node
/*jshint devel:true, node:true, undef:true, unused:strict*/

var logger = require('tracer').colorConsole();
var nodefn = require( 'when/node' );
var requestify = require( 'requestify' );
var path = require( 'path' );
var fs = require( 'fs' );
var xpath = require('xpath'),
	dom = require('xmldom').DOMParser;

Error.stackTraceLimit = 100;

var passwd = new Buffer("userid:secretcode").toString('base64');
var	header = { 'Authorization': 'Basic ' + passwd };
var realIpAddr = '';
var today = -1;
var isErrorInPrevTry = false;

var logFileName = 'ddnsUpdate.log';
var logDir = path.join( process.env.HOME, 'uLog' );

nodefn.call( fs.mkdir, logDir )
.then( function() {
	writeLog( 'Has Made the log directory: ' + logdir );
})
.catch( function( err ) {
	writeLog( JSON.stringify( err ));
})
.done( function() {
	setTimeout( update, 10000 );
	setInterval( update, 90000 );
});

function writeLog( str ) {
	console.log( str );
	fs.appendFile( path.join( logDir, logFileName ), str );
}

function update() {

	var isFirstLog = true;

	function log( str ) {
		if( isFirstLog ) {
			isFirstLog = false;
			writeLog( '\n\n------------------- ' + new Date() + ' -------------------\n' );
		}
		writeLog( str );
	}

	var newDay = (new Date()).getDay();
	if( today !== newDay || isErrorInPrevTry ) {
		log( 'I\'m alive\n' );
		today = newDay;
		isErrorInPrevTry = false;
	}

	requestify.get('http://dyna.dnsever.com/getip.php')
	.then(function( res ) {

		res.getBody();
		if( realIpAddr !== res.body ) {
			log( 'Changed IP Address to [' + res.body + '] from [' + realIpAddr + ']');
		}
		realIpAddr = res.body;
		return requestify.get( 'http://dyna.dnsever.com/gethost.php', { headers: header });
	})
	.then( function( res ) {

		res.getBody();

		var doc = new dom().parseFromString( res.body );
		var names = xpath.select( "//host/@name", doc );
		var url = "http://dyna.dnsever.com/update.php?";
		
		names.forEach( function( name ) {
			if(['utopos.me','www.utopos.me'].indexOf( name.value ) < 0 ) return;
			url += 'host['+name.value+']='+realIpAddr+'&';
		});

		// url이 길어지면 post 로 하라는데 잘 안됨.
		return requestify.get( url, { headers: header });
	})
	.then( function( res ) {

		res.getBody();
		var doc = new dom().parseFromString( res.body );
		var msgs = xpath.select( "//host/@msg", doc );

		var isAlreadyUpdated = msgs.every( function( msg ) {
			return msg.value === 'Already Updated';
		});

		if( msgs.length < 2 || !isAlreadyUpdated ) {
			log( res.body );
		}
	})
	.catch( function( err ) {
		log( JSON.stringify( err ));
		isErrorInPrevTry = true;
	});
}

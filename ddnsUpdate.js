var logger = require('tracer').colorConsole();
var request = require( 'request-promise' );
var invariant = require( 'invariant' );
var _ = require( 'underscore');
var xpath = require('xpath'),
	dom = require('xmldom').DOMParser;

var GET_HOST_URL = 'http://dyna.dnsever.com/gethost.php';
var GET_IP_URL = 'http://dyna.dnsever.com/getip.php';
var UPDATE_URL = "http://dyna.dnsever.com/update.php";

function _transformXML( body ) {
	return new dom().parseFromString( body );
}

var realIpAddr = '';
var today = -1;
function _update( id, code, targetHostNameToIp ) {

	var auth = new Buffer( id+':'+code ).toString('base64');
	var	header = {
		'Authorization': 'Basic ' + auth,
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
	};

	var newDay = (new Date()).getDay();
	if( today !== newDay ) {
		logger.info( 'Today: ', (new Date()).toLocaleDateString() );
		today = newDay;
	}

	request.get( GET_IP_URL ).then(function( body ) {

		//logger.debug( body );

		if( realIpAddr !== body ) {
			logger.info( 'Public IP address have been changed to ['+body+'] from ['+realIpAddr+']');
			realIpAddr = body;
		}

		//logger.debug( 'req url: ' + GET_HOST_URL );
		//logger.debug( 'headers: ' + JSON.stringify( header ));

		return request.get( GET_HOST_URL, {
			headers: header,
			transform: _transformXML
		});

	}).then( function( doc ) {

		//logger.debug( 'gethost res:\n' + doc.toString() );

		var resHostNameList = xpath.select( "//host/@name", doc );

		var qs = {};
		resHostNameList.forEach( function( name ) {

			var targetIp = targetHostNameToIp[ name.value ];
			if( targetIp === undefined ) return;

			if( ! targetIp ) targetIp = realIpAddr;

			qs[ 'host['+name.value+']' ] = targetIp;
		});

		if( _.isEmpty( qs )) {
			return;
		} else {
			return request.get( UPDATE_URL, {
				headers: header, transform: _transformXML, qs: qs
			});
		}

	}).then( function( doc ) {

		if( ! doc ) return;

		logger.debug( 'Update result:\n' + doc.toString() );
	})
	.catch( function( err ) {
		logger.error( err );
	});
}

function start( id, code, targetHostNameToIp ) {

	setTimeout( function() {

		id = id || process.env.DNSEVER_ID;
		code = code || process.env.DNSEVER_DDNS_SECRET_CODE;
		targetHostNameToIp = targetHostNameToIp || JSON.parse( process.env.DNSEVER_TARGET_HOST_NAME_TO_IP );

		invariant( id, 'No DNSEVER_ID');
		invariant( code, 'No DNSEVER_DDNS_SECRET_CODE');
		invariant( ! _.isEmpty( targetHostNameToIp ), 'Empty targetHostNameToIp');
		invariant( typeof targetHostNameToIp, 'targetHostNameToIp must be "object" type');

		var bindedUpdate = _update.bind( null, id, code, targetHostNameToIp );
		bindedUpdate();

		setInterval( bindedUpdate, 1000 * 90 );

	}, 1000 * 10 );
};

var autoRun = process.env.DNSEVER_AUTO_RUN || "false";
if( JSON.parse( autoRun )) {
	logger.info( require('./package.json').name + ' is run' );
	start();
}

module.exports = {
	start: start
};

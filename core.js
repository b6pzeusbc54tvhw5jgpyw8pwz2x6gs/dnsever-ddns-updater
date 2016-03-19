'use strict';

var request = require( 'request-promise' );
var when = require( 'when' );
var fs = require( 'fs' );
var path = require( 'path' );
var _ = require( 'underscore');

var log4js = require("log4js");
var log4js_extend = require("log4js-extend");
log4js_extend(log4js, { path: __dirname, format: "at @name (@file:@line)" });
var logger = log4js.getLogger("core");
 
var xpath = require('xpath'),
	dom = require('xmldom').DOMParser;

var GET_HOST_URL = 'http://dyna.dnsever.com/gethost.php';
var GET_IP_URL = 'http://dyna.dnsever.com/getip.php';
var UPDATE_URL = "http://dyna.dnsever.com/update.php";
var IP_REGEXP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


//
//init
//
const ROOT_PATH = path.resolve(process.env.HOME, '.dnsever-ddns-updater');
const LOG_PATH = path.resolve( ROOT_PATH, 'logs');
//const PROCESS_FILE_PATH = path.resolve( ROOT_PATH, 'process.json' );
const ENV_PATH = path.resolve( ROOT_PATH, 'config.json' );
let env = (function () {

	if ( fs.existsSync( ENV_PATH )) {

		var contents = fs.readFileSync( ENV_PATH, 'utf8' );
		return JSON.parse( contents );

	} else {

		return { id: '',  auth_code: '', exceptionMap: {} };
	}
}());
(function() {
  if (!fs.existsSync( ROOT_PATH )) {
    fs.mkdirSync( ROOT_PATH );
    fs.mkdirSync( LOG_PATH );
  }

  if (process.stdout._handle && process.stdout._handle.setBlocking)
    process.stdout._handle.setBlocking(true);
}());

function _transformXML( body ) {
	return new dom().parseFromString( body );
}

var realIpAddr = '';
var today = -1;
function _tick() {

	var newDay = (new Date()).getDay();
	if( today !== newDay ) {
		// 적어도 하루에 한번씩은 log를 남긴다
		logger.info( 'Today: ', (new Date()).toLocaleDateString() );
		today = newDay;
	}

	getPublicIp().then( function( ip ) {

		if( realIpAddr !== ip ) {
			logger.info('Public IP address have been changed to ['+ip+'] from ['+realIpAddr+']');
			realIpAddr = ip;
		}

		return getCurrentDDNSSetting();

	}).then( function( ddnsSettings ) {

		logger.debug( 'currentDDNSSetting: \n', ddnsSettings );

		var qs = {};
		_.each( ddnsSettings, function( ip, host ) {

			if( env.exceptionMap[ host ] === 'IGNORE' ) return;

			var targetIp;
			if( IP_REGEXP.test( env.exceptionMap[ host ] )) {
				targetIp = env.exceptionMap[ host ];
			} else {
				targetIp = realIpAddr;
			}

			if( ip === targetIp ) return;

			qs[ 'host['+host+']' ] = targetIp;
		});


		if( _.isEmpty( qs )) {
			return;
		} else {
			return request.get( UPDATE_URL, {
				headers: getHeader(), transform: _transformXML, qs: qs
			});
		}

	}).then( function( doc ) {

		if( ! doc ) return;
		logger.debug('Update result:\n' + doc.toString() );
	})
	.catch( function( err ) {
		logger.error( err );
	});
}

function start() {

	var id = env.id;
	var auth_code = env.auth_code;

	setTimeout( function() {

		if( ! id ) {
			logger.error("dnsEver.com 'id' must be set, please command below");
			logger.error('$ dnsever-ddns-updater id your_id');
			return;
		} else if( ! auth_code ) {
			logger.error("dnsEver.com 'auth_code' must be set, please command below");
			logger.error('$ dnsever-ddns-updater auth_code your_auth_code');
		}

		_tick();
		setInterval( _tick, 1000 * 90 );

	}, 1000 * 5 );
};

var autoRun = process.env.DNSEVER_AUTO_RUN || "false";
if( JSON.parse( autoRun )) {
	logger.info( require('./package.json').name + ' is run' );
	start();
}

function deleteHost() {

}

function getHeader() {

	var auth = new Buffer( env.id+':'+env.auth_code ).toString('base64');
	var	header = {
		'Authorization': 'Basic ' + auth,
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
	};
	return header;
}

function getCurrentDDNSSetting() {

	var deferred = when.defer();

	request.get( GET_HOST_URL, { headers: getHeader(), transform: _transformXML })
	.then( function( doc ) {

		//logger.debug( 'req url: ' + GET_HOST_URL );
		//logger.debug( 'headers: ' + JSON.stringify( header ));
		//logger.debug( 'gethost res:\n' + doc.toString() );

		var msg = xpath.select( "//result/@msg", doc );
		var code = xpath.select( "//result/@code", doc );
		msg = msg[0].value;
		code = code[0].value;

		if( code !== "700" ) {
			deferred.resolve({ errorCode: code, errorMsg: msg });
			return;
		}

		var resHostNameList = xpath.select( "//host/@name", doc );
		var resHostIpList = xpath.select( "//host/@ip", doc );

		var currentDDNSSetting = {};
		var name, ip;

		while( true ) {

			name = resHostNameList.pop();
			ip = resHostIpList.pop();

			if( ! name ) break;
			
			currentDDNSSetting[ name.value ] = ip.value;
		}

		deferred.resolve( currentDDNSSetting );
	});

	return deferred.promise;
}

function save() {
	var envStr = JSON.stringify( env, null, 2 );
	fs.writeFileSync( ENV_PATH, envStr );
}

function setEnv( key, val ) {

	env[ key ] = val;
	save();
}

function getEnv( key ) {
	return env[ key ];
}

function removeException( host ) {

	delete env.exceptionMap[ host ];
	save();
}
function addException( host, ip ) {
	
	env.exceptionMap[ host ] = ip;
	save();
}

function getPublicIp() {
	
	var deferred = when.defer();

	request.get( GET_IP_URL ).then(function( ip ) {

		if ( IP_REGEXP.test( ip ) ) {
			deferred.resolve( ip );
		} else {
			deferred.reject({ errorCode: 'NOT_FOUND_PUBLIC_UP' });
		}
	});

	return deferred.promise;
}

function clean() {
	env = { id: '',  auth_code: '', exceptionMap: {} };
	save();
}
function getEnvPath() {
	return ENV_PATH;
}
function getRootPath() {
	return ROOT_PATH;
}


module.exports = {
	clean: clean,
	deleteHost: deleteHost,
	setEnv: setEnv,
	getEnv: getEnv,
	addException: addException,
	removeException: removeException,
	getPublicIp: getPublicIp,
	getCurrentDDNSSetting: getCurrentDDNSSetting,
	start: start,
	getEnvPath: getEnvPath,
	getRootPath: getRootPath
};

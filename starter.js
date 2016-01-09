var logger = require('tracer').colorConsole();
var core = require('./core');

logger.info('launch a DNSEver.com DDNS Updater using pm2');
core.start();

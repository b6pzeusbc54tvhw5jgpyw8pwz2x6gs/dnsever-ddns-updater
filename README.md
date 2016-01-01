# ddns-update-for-dnsever
For [DNSEver.com](DNSEver.com) ( DNS Service in Korea ), Node Dynamic DNS Updater

# install
```
npm install dnsever-ddns-updater
```

# run with pm2
- It is recommended to use [pm2](http://pm2.keymetrics.io/).
- Insert your DNSEver account information to "env" in pm2script.json file.
- Example
```
{
	"name": "DNSEver.com DDNS Updater",
	"script": "ddnsUpdate.js",
	"watch": true,
	"ignore_watch" : ["node_modules"],
	"args": [ "--color" ],
	"env": {
		"DNSEVER_ID": "myDNSEverUserID",					      // DNSEver User ID
		"DNSEVER_DDNS_SECRET_CODE": "DDNSSecretCode",		// dnsever.com > 내정보 > DNS 환경설정 > 다이나믹DNS 인증코드
		"DNSEVER_TARGET_HOST_NAME_TO_IP": {
			"www.your-domain.cokjm": "123.123.123.123",	// It will set to 123.123.123.123
			"your-domain.com": "123.123.123.123",		  // It will set to 123.123.123.123
			"www.your-second-domain.com": null,		  	// It will set to the public ip of current PC
			"your-second-domain.com": null			    	// It will set to the public ip of current PC
		},
		"DNSEVER_AUTO_RUN": true				    	// If you want to use it by importing to other nodejs app, set to false
	}
}
```
- After edit, just type `pm2 start pm2script.json`
- You can see log: `pm2 logs "DNSEver.com DDNS Updater" --raw`
- First, the Updater will be wait for 10sec, then try update ddns every 90sec.

# run without pm2, you must type manually following command in cli.
```
DNSEVER_ID=myDNSEverUserID \
DNSEVER_DDNS_SECRET_CODE=DDNSSecretCode \
DNSEVER_TARGET_HOST_NAME_TO_IP={"www.your-domain.cokjm": "123.123.123.123","your-domain.com": "123.123.123.123"} \
DNSEVER_AUTO_RUN
node ddnsUpdate.js
```

# run as API
### Notice! Need to test!
```
var updater = require('dnsever-ddns-updater');
updater.start( 'userId', 'secretCode', {"www.your-domain.cokjm": "123.123.123.123","your-domain.com": "123.123.123.123"});
```

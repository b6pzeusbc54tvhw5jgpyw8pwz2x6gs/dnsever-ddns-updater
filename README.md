# ddns-update-for-dnsever
Nodejs DDNS Updater, for [DNSEver.com](https://DNSEver.com) ( DNS Service in Korea ).
(DDNS: Dynamic Domain Name Service)

[![npm version](https://img.shields.io/npm/v/dnsever-ddns-updater.svg?style=flat-square)](https://www.npmjs.com/package/dnsever-ddns-updater)

## pre install
프로세스 매니저인 [pm2](https://www.npmjs.com/package/pm2) 환경에서 실행됩니다.
pm2 가 설치되어 있지 않으면 아래의 명령어로 설치합니다.
```
sudo npm install -g pm2
```

## install
```
sudo npm install -g dnsever-ddns-updater
```


## Usage

1. install and show settings
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/01_install_first_run.png)

2. Set your id and auth_code, and check your domain in DNSEver.com
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/02_setting_id_auth_code.png)

3. Run process, wait 5sec, then 'Updater' will try to update your DDNS for your all domain
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/03_start.png)

4. Check new updated DDNS. Without exception, your all domain will be updated as current public_ip
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/04_result.png)

5. Every 90sec, 'Updater' compare to public ip and DNSEver.com setting. If update needed, try to update.

6. For more information use help command 
```
dnsever-ddns-updater --help
```


# ddns-update-for-dnsever
Nodejs DDNS Updater, for [DNSEver.com](DNSEver.com) ( DNS Service in Korea ).
(DDNS: Dynamic Domain Name Service)

## pre install
// 프로세스 매니저인 pm2 환경에서 실행됩니다.
// pm2 가 설치되어 있지 않으면 아래의 명령어로 설치합니다.
```
sudo npm install -g pm2
```

## install
```
sudo npm install -g dnsever-ddns-updater
```


## Usage

### install and show settings
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/01_install_first_run.png)

### Set your id and auth_code, and check your domain in DNSEver.com
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/02_setting_id_auth_code.png)

### Run process, wait 5sec, then *ths updater* will try to update your DDNS for your all domain
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/03_start.png)

### Check new updated DDNS. Without exception, your all domain will be updated as current public_ip
![](https://raw.githubusercontent.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater/master/screenshot/04_result.png)

### Every 90sec, *the updater* compare to public ip and DNSEver.com setting. If update needed, try to update.

## $ dnsever-ddns-updater --help
```
  Usage: dnsever-ddns-updater [command]


  Commands:

    show                                        display all configure value
    clean                                       Reset all settings
    exception:delete <host>                     delete host from the exception list
    exception|exception:add <host> <ip|ignore>  register host:ip to the exception list
    id <id>                                     set your DNSEver.com user id
    auth_code <auth_code>                       set your DNSEver.com auth_code
    start                                       Start the DNSEver DDNS Updater process
    stop                                        Stop the DNSEver DDNS Updater process
    log                                         display logs of the DNSEver DDNS Updater process

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Basic Examples:

    Set a your dnsEver.com id and secret code
    $ dnsever-ddns-updater id wonbin32
    $ dnsever-ddns-updater auth_code oiwj32olkd

    Show all informatino
    $ dnsever-ddns-updater show

    Start the updater process.
    $ dnsever-ddns-updater start

    Updater try to set all your host ddns to public ip.

    If you have some exception host, add exception
    $ dnsever-ddns-updater exception fakebook.com 123.123.123.123

    If you want make some ip ignored,
    $ dnsever-ddns-updater exception dev.fakebook.com IGNORE

    If you want delete some ip from the exception list,
    $ dnsever-ddns-updater exception:delete dev.fakebook.com

    More information in https://github.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/dnsever-ddns-updater
```


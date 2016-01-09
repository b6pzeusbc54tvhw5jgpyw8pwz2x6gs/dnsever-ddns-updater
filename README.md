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

## screenshot
![설치와 실행](https://f.cloud.github.com/assets/3797062/2039359/a8e938d6-899f-11e3-8789-60025ea83656.gif)


## Usage 
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


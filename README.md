# ddns-update-for-dnsever
For [DNSEver.com](DNSEver.com) ( DNS Service in Korea ), Node Dynamic DNS Updater


## install
```
sudo npm install -g dnsever-ddns-updater

// If pm2 is not installed,
sudo npm install -g pm2
```

## Usage 
```
  Usage: dnsever-ddns-updater [options] [command]


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



# cjdns-proxy experimental
---

Check out `default-config.json` for some options to help your setup.

Install 
```
git clone git://github.com/tcrowe/cjdns-proxy.git
cd cjdns-proxy
npm install
```

Start the proxy with default-config.json
```
npm start
```

Or another way
```
node index
```

Or with your own configuration file
```
node index my-custom-cjdns-config.json
```

The config file should be in this format
```json
{
    "bind": [
        "0.0.0.0:9000"
    ],
    "admin": {
        "alias": "cjdns-admin",
        "host": "127.0.0.1:8084"
    }
}
```

Notice that `bind` is an array and each item will cause this proxy to bind to that host:ip combo.

Enjoy!

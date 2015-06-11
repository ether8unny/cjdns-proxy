
# cjdns-proxy experimental
---

This is an HTTP proxy which serves as a gateway to a cjdns node. If you run cjdns in a VM this can help you connect to it in the browser. After you install this on the node you can set your browser's HTTP proxy information to the hosts you have configured to bind to.

If you are running cjdns' admin interface is also exposed with this interface. When installed visit [http://cjdns-admin]

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
node index my-custom-config.json
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

Finally, set your browser's proxy to what you have configured to bind to. Better yet, do it in an alternate browser profile.


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
    "nodes": [
        "127.0.0.1:11234"
    ],
    "algorithm": "round-robin"
}
```

Notice that `bind` and `nodes` are arrays because you can bind to multiple host/ip configurations and have them connect to the hosts in `nodes`.

`algorithm` can be `round-robin` or `random`

Enjoy!

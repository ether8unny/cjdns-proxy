
var http = require('http'),
	url = require('url'),
	httpProxy = require('http-proxy'),
	config,
	server,
	proxy;

// did the user pass the config path via command line arg?
if (process.argv[2] && process.argv[2].indexOf('.json') > -1) {
	// yes, load the config the user specified
	config = require('./' + process.argv[2]);
} else {
	// no config file passed, use default configuration
	config = require('./default-config.json');
}

if (typeof config !== 'object') {
	console.log('config is invalid, see default-config.json for an example');
	process.exit();
}

function validArray (arr) {
	return arr && Array.isArray(arr) && arr.length > 0;
}

// validate bind config
if (!validArray(config.bind)) {
	console.log('config bind is invalid, see default-config.json for an example');
	process.exit();
}

// create proxy
proxy = httpProxy.createProxyServer();

proxy.on('error', function (err, req, res) {
	var op = 'cjdns-proxy error:\n' + JSON.stringify(err, null, '\t');
	res.writeHead(500, { 'Content-Type': 'text/plain' });
	res.end(op);
	console.log(op);
});

// handle the requests to be proxied
function serverRequestHandler (req, res) {
	var options,
		host = req.headers.host;

	// see ./default-config.json for the `admin` section
	// should redirect cjdns-admin to 127.0.0.1:8
	if (config.admin && config.admin.alias &&host.indexOf(config.admin.alias) === 0) {
		host = config.admin.host;
	}

	// setup the proxy's config
	options = {
		target: 'http://' + host,
		ws: true,
		xfwd: true
	};

	// attempt to proxy the request
	console.log('%s %s', req.method, req.url);
	proxy.web(req, res, options);
}

// create server
server = http.createServer(serverRequestHandler);

// bind to each of the hosts in the config
config.bind.forEach(function (item) {
	var hostParts = item.split(':'),
		host = hostParts[0],
		port = hostParts[1];
	server.listen(port, host);
	console.log('cjdns-proxy listening %s', item);
});

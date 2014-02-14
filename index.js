
var http = require('http'),
	httpProxy = require('http-proxy'),
	config,
	server,
	proxy,
	roundRobinIndex = 0,
	nodeAlgorithm;

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
	console.log('something');
	console.log('**' + config.bind + '**');
	console.log('**' + config.bind + '**');
	console.log('**' + config.bind + '**');
	console.dir(config.bind);
	console.log('config bind is invalid, see default-config.json for an example');
	process.exit();
}

// validate nodes config
if (!validArray(config.nodes)) {
	console.log('config nodes is invalid, see default-config.json for an example');
	process.exit();
}

// validate algorithm config
if (!config.algorithm || typeof config.algorithm !== 'string') {
	console.log('config algorithm is invalid, see default-config.json for an example');
	process.exit();
}

function nodeAlgorithmRoundRobin (nodes) {
	var node = nodes[roundRobinIndex];

	// advance the counter
	roundRobinIndex += 1;

	// reset the count if needed
	if (roundRobinIndex === nodes.length) {
		roundRobinIndex = 0;
	}

	return node;
}

function nodeAlgorithmRandom (nodes) {
	return nodes[Math.floor(Math.random() * nodes.length)];
}

if (config.algorithm === 'round-robin') {
	nodeAlgorithm = nodeAlgorithmRoundRobin
} else if (config.algorithm === 'random') {
	nodeAlgorithm = nodeAlgorithmRandom;
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
	var options;

	// setup the proxy's config
	options = {
		target: nodeAlgorithm('http://' + config.nodes)
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
var Ejs = require('ejs');
var Hapi = require('hapi');

/**
 * create and start hapi server
 */
var serverOptions = {
	/* Cross-Origin Resource Sharing */
	cors: true,
	/* template engine on */
	views: { 
		engines: {
			ejs: 'Ejs'
		},
		path: './static/templates'
	}
};
var server = new Hapi.Server('localhost', 3001, serverOptions);
server.start(function(){
	console.log('server started');
});

/**
 * handlers
 */
var home = function(request, reply) {
	reply('hello');
};
var fileHandler = {file:'./static/index.html'};
var dirHandler = {directory: {
		path:'./static',
		index: false,
		listing: true
}};
var templatedHandler = {view: {
		template: 'message', 
		context: {message: 'Hello message!'}
}};
var templatedHandler2 = function(request, reply) {
	reply.view('message', {message: 'Goodbye message!'});
}
var proxyHandler = {proxy: {
	host: 'localhost',
	port: 80,
	protocol: 'http',
	onResponse: function() {
		console.log('on response');
	}
}};
var withPreHandler = function(request, reply) {
	reply('Pre, '+JSON.stringify(request.pre,null,1));
}

/**
 * prerequisites methods
 */
var pre1 = function(request, reply) {
	reply('Done');
}
var pre2 = function(request, reply) {
	reply('John');
}

/**
 * routes
 */
server.route([
	{ method: 'GET', path: '/', handler: home},
	{ method: 'GET', path: '/file', handler: fileHandler},
	{ method: 'GET', path: '/dir/{path*}', handler: dirHandler},
	{ method: 'GET', path: '/ejs', handler: templatedHandler},
	{ method: 'GET', path: '/ejs2', handler: templatedHandler2},
	{ method: 'GET', path: '/proxy', handler: proxyHandler},
	{ method: 'GET', path: '/pre', handler: withPreHandler, config: {
		pre: [{method:pre1, assign:'pre1'}, {method:pre2, assign:'pre2'}]
	}}
]);
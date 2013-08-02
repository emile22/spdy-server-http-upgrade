spdy_server-http-upgrade:
--------------------------------

This package adds the HTTP version negociation in clear (http://tools.ietf.org/html/draft-ietf-httpbis-http2-04#section-3.2) to indutny node-spdy server (https://github.com/indutny/node-spdy).

The intend of the work is to make some 'HTTP2 upgrade in the clear' interoperability tests during the HTTP2 interim meeting next week in Hambourg. 

With this addon a spdy session negociates the HTTP2 flavor (spdy/2, spdy/3, HTTP-DRAFT-04/2.0 ...) using HTTP1.1 Upgrade field, 

The package includes the flags example of mod_spdy.


Notes:
-----

A node-spdy client which supports HTTP version negociation in clear is available at https://github.com/bmuscotty/spdy-server-http-upgrade. 
 
Examples: 
--------

```
var spdy = require('spdy');
var express = require('express');
var http = require('http');
var app = express();

// pure TLS: plain true and ssl true
// SPDY in clear: plain true and TLS false
// SPDY over TLS: plain false and TLS true
//
var options = {
  windowSize: 1024
  , debug: true
  , plain: true
  , ssl: false
  , port:1337
};

app.configure(function() {
   app.use(express.static(__dirname));
   app.use(express.errorHandler());
});

       
var server = spdy.createServer(options, app);
server.listen(options.port);

server.on('upgrade', function(request, socket, header) {
  socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
               'Connection: Upgrade\r\n' +
               'Upgrade: ' + request.headers.upgrade +'\r\n' +
               '\r\n'
             );
  this._onConnection(socket);
});


```

Install:
-------
you must install node.js and npm first. 
Then you need several additionnal nodeJS modules. Install them with npm
'''
npm -install <name of the module missing> 
'''
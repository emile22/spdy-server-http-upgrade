/* Emile Stephan 2013 */

var spdy = require('spdy');
var express = require('express');
var app = express();
var fs = require('fs');
var path = require ('path');
var util = require('util');
var colors = require('colors');
var http = require('http');

// pure TLS: plain true and ssl true
// SPDY in clear: plain true and TLS false
// SPDY over TLS: plain false and TLS true
//
var options = {
  windowSize: 1024
  , debug: true /* WARNING activating debug has side effects, it prevents the fallback to pure https (HTTP1.1/TLS) */
  , plain: true /* for spdy don't set plain and tls to true together */
  , ssl: false
  , port:1337
};

app.configure(function() {

   if (options.ssl) {
		var dirkeys = __dirname;
		options.key= fs.readFileSync(dirkeys + '/keys/spdy-key.pem');
		options.cert= fs.readFileSync(dirkeys + '/keys/spdy-cert.pem');
		options.ca= fs.readFileSync(dirkeys + '/keys/spdy-csr.pem');
   }
   app.use(express.logger('dev')); // default short tiny dev

   app.use(express.static(__dirname));

   app.use(express.errorHandler());
   
});

       
var server = spdy.createServer(options, app);
server.listen(options.port);

console.log('spdy server'.white + ' started '.green.bold);
util.puts('configuration:'.green);
console.dir( options);
util.puts('try'.white +  ' Use path /flags/world-flags.htm'.yellow);

server.on('request', function temp1(req, res) {
   util.puts('server.on request:'
   + ' isSpdy:' + res.isSpdy.toString().yellow
   + ' spdy:'+ req.spdyVersion.toString().green
   + ' url:'+ req.url.yellow );
 });
 

server.on('upgrade', function(request, socket, header) {
  console.log('request.headers upgrade:', request.headers.upgrade);
  console.log('request.headers Connection:', request.headers.connection);
  socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
               'Connection: Upgrade\r\n' +
               'Upgrade: ' + request.headers.upgrade +'\r\n' +
               '\r\n'
             );
  this._onConnection(socket);
});





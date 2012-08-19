var socket = require('socket.io');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require("util");

/* map of events
  subscribe
  unsubscribe
*/

var Client = function(socket){
  if (!(this instanceof Client)) return new Client(socket);
  EventEmitter2.apply(this, arguments);
  this.setMaxListeners(0); //unlimited
  this.id = socket.id;
  if(!this.id){
    throw new Error('unable to determine socket.id');
  }
  this.socket = socket;
  this.hook();
};
util.inherits(Client, EventEmitter2);

Client.prototype.hook = function(){
  this.socket.on('subscribe', (function(data){
    this.emit('subscribe', data);
  }).bind(this));
  this.socket.on('unsubscribe', (function(data){
    this.emit('unsubscribe', data);
  }).bind(this));
};

Client.prototype.write = function(data){
  this.socket.emit('data', data);
};

var ClientServer = function(io, resourceServer){
  if (!(this instanceof ClientServer)) return new ClientServer(http);
  EventEmitter2.apply(this, arguments);
  this.setMaxListeners(0); //unlimited

  this.io = io;
  this.rs = resourceServer;
  this.hook();
};
util.inherits(ClientServer, EventEmitter2);

ClientServer.prototype.hook = function(){
  this.io.sockets.on('connection', this.add.bind(this));
};

ClientServer.prototype.add = function(socket){
  var client = new Client(socket);
  var rs = this.rs;
  
  rs.connect(client);
  socket.on('disconnect', function(){
    rs.disconnect(client);
  });
};

module.exports = ClientServer;
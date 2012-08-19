var test = require('tap').test;
var Client = require('../socket-io-client');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var fakeSocketIO = function(){
  var io = new EventEmitter2();
  io.sockets = new EventEmitter2();
  io.connect = function(){
    if(this.socket){return;}
    this.socket = new EventEmitter2();
    this.socket.id = 'bob';
    this.sockets.emit('connection', this.socket);
  };

  io.disconnect = function(){
    if(!this.socket){return;}
    this.socket.emit('disconnect', this.socket);
    delete this.socket;
  };

  io.sub = function(resource){
    this.socket.emit('subscribe', resource);
  };

  io.unsub = function(resource){
    this.socket.emit('unsubscribe', resource);
  };

  return io;
};

var fakeResourceServer = function(){
  var rs = new EventEmitter2();
  rs.connect = function(c){this.emit('connect', c);};
  rs.disconnect = function(c){this.emit('disconnect',c);};
  return rs;
};

test('invocation tests', function(t){
  t.plan(3);
  var io = fakeSocketIO();
  var rs = fakeResourceServer();
  t.ok(Client);
  t.ok(Client(io, rs));
  t.ok(new Client(io,rs));
});

test('lets connect and disconnect', function(t){
  t.plan(2);
  var rs = fakeResourceServer();
  var io = fakeSocketIO();
  var clientserver = new Client(io, rs);
  rs.on('connect', function(c){
    t.ok(c, 'connect event fired on fake rs');
  });
  rs.on('disconnect', function(c){
    t.ok(c, 'disconnect event fired on fake rs');
  });
  io.connect();
  io.disconnect();
});

test('lets subscribe and unsubscribe', function(t){
  t.plan(2);
  var rs = fakeResourceServer();
  var io = fakeSocketIO();
  var clientserver = new Client(io, rs);
  var resource = 'http://seawind/people/8';
  rs.on('connect', function(client){
    client.on('subscribe', function(r){
      t.equals(r, resource, 'subscribe event fired on client');
    });
    client.on('unsubscribe', function(r){
      t.equals(r, resource, 'unsubscribe event fired on client');
    });
  });
  io.connect();
  io.sub(resource);
  io.unsub(resource);
});
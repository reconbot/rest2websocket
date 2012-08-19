var test = require('tap').test;
var ResourceServer = require('../resource-server');
var EventEmitter2 = require('eventemitter2').EventEmitter2;


// stub client that emits data events
var makeClient = function(){
  var client = new EventEmitter2();
  client.id = 'bob';
  client.write = function(data){ this.emit('data', data);};
  return client;
};

test('startup', function(t){
  t.ok(ResourceServer,'event server was loaded');
  t.ok(new ResourceServer(), 'event server was created');
  t.ok(ResourceServer(), 'event server was created');
  t.end();
});


test('clients come and go',function(t){
  t.plan(4);
  var rs = ResourceServer();
  var client = makeClient();
  rs.on('connect',function(c){
    t.equal(c, client, 'client connection event');
  });

  rs.on('disconnect',function(c){
    t.equal(c, client, 'client disconnect event');
  });

  rs.connect(client);
  t.ok(rs.clients.bob, 'client was added');

  rs.disconnect(client);
  t.ok(!rs.clients.bob, 'client was removed');
  t.end();
});

test('clients subscribe so many times', function(t){
  t.plan(2);
  var client = makeClient();
  var rs = ResourceServer();
  rs.connect(client);
  var resource = 'http://fake.email.com/emails/44';

  rs.on('subscribe', function(res){
    t.equal(res, resource, 'subscribe event fired');
  });
  rs.on('unsubscribe', function(res){
    t.equal(res, resource, 'unsubscribe event fired');
  });

  client.emit('subscribe', resource);
  client.emit('subscribe', resource);
  client.emit('unsubscribe', resource);
  client.emit('unsubscribe', resource);
  t.end();
});

test('clients disconnect before unsubscribing', function(t){
  t.plan(2);
  var client = makeClient();
  var rs = ResourceServer();
  rs.connect(client);
  var resource = 'http://fake.email.com/emails/44';

  rs.on('subscribe', function(res){
    t.equal(res, resource, 'subscribe event fired');
  });
  rs.on('unsubscribe', function(res){
    t.equal(res, resource, 'unsubscribe event fired');
  });

  client.emit('subscribe', resource);
  rs.disconnect(client);
  t.end();
});

test('publish some data to a client',function(t){
  t.plan(1);
  var client = makeClient();
  var rs = ResourceServer();
  rs.connect(client);
  var resource = 'http://fake.email.com/emails/44';
  var data = {
    resource: resource,
    data: 'foobar!'
  };
  client.emit('subscribe', resource);

  client.on('data', function(d){
    t.equal(d, data, 'Data is emitted');
  });
  rs.publish(data);
  client.emit('unsubscribe', resource);
  rs.publish(data);
});
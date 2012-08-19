var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require("util");

/* Catalog of events
  connect -> client
  disconnect -> client
  subscribe -> resource
  unsubscribe -> resource
*/

var ResourceServer = function(){
  if (!(this instanceof ResourceServer)) return new ResourceServer();
  this.resources = {};
  EventEmitter2.apply(this, arguments);
  this.setMaxListeners(0); //unlimited
  this.clients = {};
  this.resources = {};
};
util.inherits(ResourceServer, EventEmitter2);

var clientID = function(client){
  return client.id;
};

ResourceServer.prototype.connect = function(client){
  var id = clientID(client);
  if(this.clients[id]){ return; }
  
  var sendData = function(data){
    client.write(data);
  };

  var sub = (function(resource){
    if(this.clients[id].subs[resource]){
      return;
    }
    this.clients[id].subs[resource] = true;
    this.on(resource, sendData);

    if(!this.resources[resource]){
      this.resources[resource] = 1;
      this.emit('subscribe', resource);
    }else{
      this.resources[resource] ++;
    }
  }).bind(this);

  var unsub = (function(resource){
    if(!this.clients[id].subs[resource]){
      return;
    }

    this.off(resource, sendData);
    this.resources[resource] --;
    delete this.clients[id].subs[resource];

    if(this.resources[resource] <= 0){
      delete this.resources[resource];
      this.emit('unsubscribe', resource);
    }

  }).bind(this);

  this.clients[id] = {
    subs: {},
    id: id,
    sendData: sendData,
    sub: sub,
    unsub: unsub
  };

  client.on('subscribe',sub);
  client.on('unsubscribe', unsub);

  this.emit('connect', client);
};

ResourceServer.prototype.disconnect = function(client){
  var id = clientID(client);
  var data = this.clients[id];
  for(var resource in data.subs){
    data.unsub(resource);
  }
  client.off('subscribe', data.sub);
  client.off('unsubscribe', data.unsub);
  delete this.clients[id];

  this.emit('disconnect', client);
};

ResourceServer.prototype.publish = function(data){
  this.emit(data.resource, data);
};

module.exports = ResourceServer;

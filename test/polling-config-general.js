var test = require('tap').test;
var config = require('../polling-config');

test(function(t){
  t.ok(config,'config was loaded');
  t.end();
});

test(function(t){
  var defaults = config.defaults;
  var added = config.add({'regex':'sdfjlsdkfj'});
  t.ok(added, 'Config addded');
  t.equal(added, config.configs[0], 'config is in configs array');
  t.equal(added.timeout, defaults.timeout, 'config inherited defautls');
  t.ok(added.headers !== defaults.headers, 'config got a clone of default headers');
  t.ok(!config.add({}),'adding a bogus config doesn\'t work');
  t.end();
});

test(function(t){
  var folks = {
    'regex': 'http://coolapi.com/awesome/folks/.*'
  };
  var coolapi = {
    'regex': 'http://coolapi.com/.*'
  };
  t.ok(config.add(folks));
  t.ok(config.add(coolapi));
  var url = 'http://coolapi.com/awesome/folks/';
  t.equal(config.match(url), folks);
  var url2 = 'http://coolapi.com/whatever/';
  t.equal(config.match(url2), coolapi);
  t.end();
});
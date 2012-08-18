var _ = require('underscore');

var defaults = module.exports.defaults = {
  // defaults if a key is missing - regex key is required
  //"regex": ".*", //^ and $ are tacked upon the string here
  "regex-flags": "i", // not sure if any of the others make sense
  "interval": 30,
  "timeout": 5,
  "concurrent": 5, // for all resources this regex matches
  "method": "GET",
  "querystring": "", //gets appended to the url of a subscription if a querystring isn"t present
  "headers": {
    "X-Requested-With": "XMLHttpRequest"
  }
};

var configs = module.exports.configs = [];

var loadDefault = function(line){
  if(!line.headers){ //deep copy headers
    line.headers = _.clone(defaults.headers);
  }
  _.defaults(line, defaults);
  return line;
};

var add = module.exports.add = function(config){
  if(!config.regex){ return; }
  loadDefault(config);
  configs.push(config);
  return config;
};

var match = module.exports.match = function(resource){
  var winner;
  for(var i = 0; i < configs.length; i++){
    var line = configs[i];
    if(RegExp(line.regex, line['regex-flags']).test(resource)){
      winner = line;
      break;
    }
  }
  return winner;
};
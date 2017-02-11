# REST2WEBSOCKET

[![Greenkeeper badge](https://badges.greenkeeper.io/reconbot/rest2websocket.svg)](https://greenkeeper.io/)

I want to use websockets on an app that has a perl cgi backend. That stack wont do it easily so this is my workaround. Clients can subscribe to updates, and servers can post updates, and this app can poll for updates if there are subscribed clients. 

[![Build Status](https://secure.travis-ci.org/reconbot/rest2websocket.png)](http://travis-ci.org/reconbot/rest2websocket)

## BEHAVIOR

The server sets a socket.io and express server. Clients load '/client.js' which gives them rest2websocket client which a user can subscribe to resources. Subscriptions are sent to the server and will trigger polling if a polling rule matches or will wait for something to post to it. When all clients that are subscribed to a resource either unsubscribe or disconnect the server will stop polling a polled resource. 

## Client

The r2w client is an event emitter that will emit data for any subscribed resource. The event name being the resource's url. If the content type of the resource is application-json we'll decode it for you. 

```javascript
// client
var r2w = new Rest2websocket();
r2w.subscribe('http://www.whatever.com/people/4', function(body, response){
  console.log(response);
  //  {
  //    url:  'http://www.whatever.com/people/4',
  //    content-type: 'application/json'
  //  }
  console.log(typeof body);
  // object
}
});
```
## Server

There are two ways to get the server to emit a resource. Post to it from whatever, probably your legacy app as it knows best. (Access control doesn't exist yet.) or setup a polling.json. 

### Posting
Anyone who posts to /publish with an object of the following configuration will get their data sent to subscribed clients. Data can be a string or a javascript object. Headers are optional and will be passed as a mock request object. If data is a object content-type will get set to 'application/json', if data is a string it will be set to 'text/plain'.

```javascript
websocket pub/sub api
  // posted to /publish
  // Headers:
  //    content-type: application-json
  // Body
    {
      url: 'http://whatever/whoever/idk',
      data: String() || Object(),
      headers: {
        content-type: 'any type you want'
      }
    }
```

### Polling

Polling needs to be configured. On startup the server will read a polling.json if one exists.

```javascript
//polling.json
[
  /* defaults if a key is missing - regex key is required
  {
    'regex': '.*', //^ and $ are tacked upon the string here 
    'regex-flags': 'i', // not sure if any of the others make sense
    'interval': 30,
    'timeout': 5,
    'concurrent': 5, // for all resources this regex matches 
    'method': 'GET',
    'querystring': '', //gets appended to the url of a subscription if a querystring isn't present
    'headers': {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  */

  {
    'regex': 'http://www.whatever.com/people/\d+',
    'interval': 5
  },
  {
    'regex': 'http://www.whatever.com/.*'
  }

]
```

TODO 
===
(things that are out of scope of the initial release)

  - override nodejs's default max host connection limit to something sane
  - support some sort of access control scheeme
    - maybe pass along supplied cookies and do a test get of the resource
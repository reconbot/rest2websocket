REST2WEBSOCKET
===
I want to use websockets on an app that has a perl cgi backend. That stack wont do it easily so this is my workaround. Clients can subscribe to updates, and servers can post updates, and this app can poll for updates if there are subscribed clients. 

BEHAVIOR
===
The server sets a shoe and an express server


TODO 
===
(things that are out of scope of the initial release)

  - support some sort of access control scheeme
    - maybe pass along supplied cookies and do a test get of the resource


````
websocket pub/sub api
  post to /publish
    {
      url: 'http://whatever/whoever/idk',
      data: string || object,
      content-type: 'type',
      x-whateverheaders: string
    }
  emit('http://whatver/whoever/idk', data);
  emit('http://whatever/whoever', data);
  emit('http://whatever/', data);
  emit('all', data);

Polling api
  client emit('subscribe', 'http://whatever/whoever/idk');
  Server polls url posts to /publish
    Server has settings [
      { //default settings
        url: /regex/,
        interval: 30,
        timeout: 5,
        method: 'GET',
      },
    ]
````
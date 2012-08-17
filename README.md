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

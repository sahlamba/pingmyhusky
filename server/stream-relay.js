const http = require('http');

const STREAM_RELAY_PORT = process.env.STREAM_RELAY_PORT || 3001;

module.exports = (STREAM_SECRET, io) => {
  const streamServer = http
    .createServer((request, response) => {
      let params = request.url.substr(1).split('/');

      if (params[0] !== STREAM_SECRET) {
        console.log(
          'Failed Stream Connection: ' +
            request.socket.remoteAddress +
            ':' +
            request.socket.remotePort +
            ' - incorrect STREAM_SECRET.'
        );
        response.end();
      }

      response.connection.setTimeout(0);
      console.log(
        'Stream Connected: ' +
          request.socket.remoteAddress +
          ':' +
          request.socket.remotePort
      );
      request.on('data', function(data) {
        // send stream data to clients in stream room
        io.to('stream').emit('relay:stream_data', data);
      });
      request.on('end', function() {
        console.log('Close request');
      });
    })
    .listen(STREAM_RELAY_PORT);
};

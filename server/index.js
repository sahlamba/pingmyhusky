const path = require('path');

const http = require('http');
const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const routes = require('./routes');

const APP_PORT = process.env.APP_PORT || 3000;

if (process.argv.length < 3) {
  console.log(
    'Usage: \n' +
      'node . <secret> [<stream-port> <app-port>] \n' +
      'Please pass STREAM_SECRET: npm start -- STREAM_SECRET'
  );
  process.exit();
}
const STREAM_SECRET = process.argv[2];

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

server.listen(APP_PORT, err => {
  if (err) throw err;
  console.log('App listening on port ' + APP_PORT + '!');
});

io.totalConnections = 0;
io.on('connection', socket => {
  io.totalConnections++;
  socket.join('stream');
  console.log('Client connected, total: ' + io.totalConnections);

  socket.emit('server:data', 'A message from server');

  socket.on('client:ack_data', data => {
    console.log('Got this back from client: ' + data);
  });

  // passthrough relay:stream_data to clients
  socket.on('relay:stream_data', data => {
    socket.emit('server:stream_data', data);
  });

  socket.on('disconnect', () => {
    io.totalConnections--;
    socket.leave('stream');
    console.log('Client disconnected, total: ' + io.totalConnections + '\n***');
  });
});

require('./stream-relay')(STREAM_SECRET, io);

const path = require('path');

const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const routes = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

server.listen(3000, err => {
  if (err) throw err;
  console.log('App listening on port 3000!');
});

io.totalConnections = 0;
io.on('connection', socket => {
  io.totalConnections++;
  console.log('Client connected, total: ' + io.totalConnections);

  socket.emit('data', 'Send this to the client');

  socket.on('disconnect', () => {
    io.totalConnections--;
    console.log('Client disconnected, total: ' + io.totalConnections);
  });
});

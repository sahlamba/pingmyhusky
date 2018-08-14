var socket = io.connect('http://localhost:3000');

socket.on('data', function(data) {
  console.log(data);
  socket.emit('ack_data', data);
});

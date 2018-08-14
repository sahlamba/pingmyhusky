const socket = io.connect('http://localhost:9042');

socket.on('server:data', function(data) {
  console.log(data);
  socket.emit('client:ack_data', data);
});

socket.on('server:stream_data', function(stream_data) {
  console.log(stream_data);
});

// Use this to pipe to JSMPEG Player
// https://github.com/ShinobiCCTV/jsmpeg-pipe

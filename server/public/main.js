const BASE_URL = 'http://localhost:9042';

const socket = io.connect(BASE_URL);

socket.on('server:data', function(data) {
  console.log(data);
  socket.emit('client:ack_data', data);
});

// Listen to relay server's event
socket.on('relay:stream_data', function(stream_data) {
  console.log(stream_data);
});

function playSound() {
  let req = new XMLHttpRequest();

  req.open('GET', BASE_URL + '/control/sound?play=sound.mp3', true);

  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      const responseDiv = document.getElementById('play-sound-response');
      if (req.status === 200) {
        responseDiv.innerHTML = req.response;
      }
      if (req.status === 400) {
        responseDiv.innerHTML = req.statusText;
      }
    }
  };

  req.send(null);
}

// Use this to pipe to JSMPEG Player
// https://github.com/ShinobiCCTV/jsmpeg-pipe

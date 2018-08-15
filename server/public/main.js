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
  const butt = document.getElementById('play-sound-button');

  butt.disabled = true;
  let req = new XMLHttpRequest();
  req.open('GET', BASE_URL + '/control/sound?play=roadrunner.mp3', true);

  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      const responseDiv = document.getElementById('play-sound-log');
      if (req.status === 200) {
        responseDiv.innerHTML += req.response + '<br/>';
      } else {
        responseDiv.innerHTML += req.statusText + '<br/>';
      }
      butt.disabled = false;
    }
  };

  req.send(null);
}

// Use this to pipe to JSMPEG Player
// https://github.com/ShinobiCCTV/jsmpeg-pipe

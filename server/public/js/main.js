/* global document, window, XMLHttpRequest, io, JSMpeg */

const BASE_URL = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? `:${window.location.port}` : ''
}`;

const socket = io.connect(BASE_URL);

const streamPlayer = new JSMpeg.Player('pipe', {
  canvas: document.getElementById('stream-canvas'),
});

socket.on('server:data', (data) => {
  // eslint-disable-next-line
  console.log(data);
  socket.emit('client:ack_data', data);
});

// Listen to relay server's event and pipe to JSMpeg Player
socket.on('relay:stream_data', (streamData) => {
  streamPlayer.write(streamData, () => {});
});

// eslint-disable-next-line
function playSound() {
  const butt = document.getElementById('play-sound-button');

  butt.disabled = true;
  const req = new XMLHttpRequest();
  req.open('GET', '/control/sound?play=roadrunner.mp3', true);

  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      const responseDiv = document.getElementById('play-sound-log');
      if (req.status === 200) {
        responseDiv.innerHTML += `${req.response}<br/>`;
      } else {
        responseDiv.innerHTML += `${req.statusText}<br/>`;
      }
      butt.disabled = false;
    }
  };

  req.send(null);
}

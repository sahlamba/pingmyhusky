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
function playSound(filename) {
  const butts = document.getElementsByClassName('play-sound-button');

  for (let i = 0; i < butts.length; i += 1) {
    butts[i].disabled = true;
  }
  const req = new XMLHttpRequest();
  req.open('GET', `/control/sound?play=${filename}`, true);

  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      const responseDiv = document.getElementById('play-sound-log');
      if (req.status === 200) {
        responseDiv.innerHTML += `${req.response}<br/>`;
      } else {
        responseDiv.innerHTML += `${req.statusText}<br/>`;
      }
      for (let i = 0; i < butts.length; i += 1) {
        butts[i].disabled = false;
      }
    }
  };

  req.send(null);
}

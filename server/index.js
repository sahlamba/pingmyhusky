const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const session = require('express-session');
const LokiSessionStore = require('connect-loki')(session);

const routes = require('./routes');

const APP_PORT = process.env.APP_PORT || 3000;

if (process.argv.length < 3) {
  // eslint-disable-next-line
  console.log(
    'Usage: \n'
      + 'node . <secret> [<stream-port> <app-port>] \n'
      + 'Please pass STREAM_SECRET: npm start -- STREAM_SECRET',
  );
  process.exit();
}
const STREAM_SECRET = process.argv[2];

app.use(
  session({
    store: new LokiSessionStore({
      tty: 0, // to delete stale sessions, this enables instant reauth after logging out
    }),
    secret: process.env.SESSION_SECRET,
    cookie: {
      expires: new Date(Date.now() + 24 * 3600 * 1000), // 24 hours
    },
  }),
);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public', 'views'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(routes);

server.listen(APP_PORT, (err) => {
  if (err) throw err;
  // eslint-disable-next-line
  console.log(`App listening on port ${APP_PORT}!`);
});

io.totalConnections = 0;
io.on('connection', (socket) => {
  io.totalConnections += 1;
  socket.join('stream');
  // eslint-disable-next-line
  console.log(`Client connected, total: ${io.totalConnections}`);

  socket.emit('server:data', 'A message from server');

  socket.on('client:ack_data', (data) => {
    // eslint-disable-next-line
    console.log(`Got this back from client: ${data}`);
  });

  socket.on('disconnect', () => {
    io.totalConnections -= 1;
    socket.leave('stream');
    // eslint-disable-next-line
    console.log(`Client disconnected, total: ${io.totalConnections}\n***`);
  });
});

require('./stream-relay')(STREAM_SECRET, io);

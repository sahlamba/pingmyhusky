const path = require('path');

const express = require('express');
const app = express();

const routes = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.listen(3000, err => {
  if (err) throw err;
  console.log('App listening on port 3000!');
});

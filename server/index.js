const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, err => {
  if (err) throw err;
  console.log('App listening on port 3000!');
});

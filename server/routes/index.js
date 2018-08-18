const express = require('express');
const controls = require('../controls');

const router = express.Router();

router.get('/control/sound', controls.playSound);

router.get('/', (req, res) => {
  res.render('index.html');
});

module.exports = router;

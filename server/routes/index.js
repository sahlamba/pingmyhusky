const express = require('express');
const controls = require('../controls');

const auth = require('../controls/auth');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login.html');
});

router.post('/control/login', auth.login);

router.get('/logout', auth.logout);

// Protected Routes
router.get('/', auth.isAuth, (req, res) => {
  res.render('index.html');
});

router.get('/control/sound', auth.isAuth, controls.playSound);

module.exports = router;

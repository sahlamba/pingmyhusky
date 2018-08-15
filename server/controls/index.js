const path = require('path');
const player = require('play-sound')((opts = {}));

const playSound = (req, res) => {
  if (req && req.query && req.query.play && req.query.play.length) {
    const soundFile = req.query.play;
    console.log('[control] Sound requested: ', soundFile);
    player.play(path.join(__dirname, '..', 'media', soundFile), err => {
      if (err) {
        res.statusCode = 500;
        res.statusMessage = `Could not play sound: ${err}`;
        res.end();
      } else {
        res.json({
          success: true,
          operation: 'control-sound',
          query: req.query,
        });
      }
    });
  } else {
    res.statusCode = 400;
    res.statusMessage = 'Invalid query in req: ' + JSON.stringify(req.query);
    res.end();
  }
};

module.exports = {
  playSound,
};

const playSound = (req, res) => {
  if (req && req.query && req.query.play && req.query.play.length) {
    const soundFile = req.query.play;
    console.log('[control] Sound requested: ', soundFile);
    res.json({ success: true, operation: 'control-sound', query: req.query });
  }
  res.statusCode = 400;
  res.statusMessage = 'Invalid query in req: ' + JSON.stringify(req.query);
  res.end();
};

module.exports = {
  playSound,
};

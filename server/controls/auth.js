const isAuth = (req, res, next) => {
  if (!req.session.username) {
    res.statusCode = 403;
    res.statusMessage = 'You are not authorized to go further!';
    res.redirect('/login');
  } else {
    next();
  }
};

const login = (req, res) => {
  if (
    req
    && req.body
    && req.body.username
    && req.body.password
    && req.body.username.length
    && req.body.password.length
  ) {
    // eslint-disable-next-line
    const { username, password } = req.body;
    // check validity of creds here from Loki User DB
    req.session.username = username;
    res.redirect('/');
  } else {
    res.statusCode = 400;
    res.statusMessage = `Invalid input in req: ${JSON.stringify(req.body)}`;
    res.end();
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = {
  isAuth,
  login,
  logout,
};

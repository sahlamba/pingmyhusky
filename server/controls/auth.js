const Loki = require('lokijs');

const db = new Loki('auth.db', {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
});

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

    // Uncomment first time to create auth DB with single user added
    // const users = db.addCollection('users', {
    //   indices: ['username', 'password_encrypted'],
    // });
    // users.insert({
    //   username,
    //   password_encrypted: password,
    // });
    // // eslint-disable-next-line
    // console.log(users.get(1));

    const users2 = db.getCollection('users');

    const result = users2.find({ username, password_encrypted: password });
    if (result.length === 1) {
      // unique user exists
      req.session.username = username;
      res.redirect('/');
    } else {
      res.statusCode = 404;
      res.statusMessage = 'Username not found!';
      res.end();
    }
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

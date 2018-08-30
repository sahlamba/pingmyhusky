/* eslint no-console:off */

const Loki = require('lokijs');

const db = new Loki('auth.db', {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
});

const isAuth = (req, res, next) => {
  console.log({ isAuthSession: req.session });

  if (!req.session.username) {
    console.log('Not authorized!');
    res.statusCode = 403;
    res.statusMessage = 'You are not authorized to go further!';
    res.redirect('/login');
  } else {
    next();
  }
};

const login = (req, res) => {
  console.log({ loginSession: req.session });

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
      console.log('Unique user exists!');
      req.session.username = username;
      res.redirect('/');
    } else {
      console.log('Username not found!');
      res.statusCode = 404;
      res.statusMessage = 'Username not found!';
      res.end();
    }
  } else {
    console.log('Invalid input in request!');
    res.statusCode = 400;
    res.statusMessage = `Invalid input in req: ${JSON.stringify(req.body)}`;
    res.end();
  }
};

const logout = (req, res) => {
  req.session.destroy();
  console.log({ logoutSession: req.session });

  res.redirect('/');
};

module.exports = {
  isAuth,
  login,
  logout,
};

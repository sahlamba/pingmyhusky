/* global document, window, XMLHttpRequest */

// eslint-disable-next-line
function login() {
  const butt = document.getElementById('login-button');

  butt.disabled = true;

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username.length && password.length) {
    const payload = {
      username,
      password,
    };

    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9042/control/login', true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        const responseDiv = document.getElementById('login-error-log');
        if (req.status === 200) {
          window.location = req.responseURL;
        } else {
          responseDiv.innerText += `${req.statusText}<br/>`;
        }
        butt.disabled = false;
      }
    };

    req.send(JSON.stringify(payload));
  } else {
    const logDiv = document.getElementById('login-error-log');
    logDiv.innerText = 'Invalid Username/Password';
  }
}

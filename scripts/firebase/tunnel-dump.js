require('dotenv').config();
const axios = require('axios');

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./pingmyhusky-firebase-service-account-key.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

try {
  axios.get('http://127.0.0.1:4040/api/tunnels').then((res) => {
    const database = firebaseAdmin.database();
    database.ref('/stream').child('tunnels').set(res.data.tunnels)
      .then(() => {
        process.exit();
      })
      .catch((firebaseError) => {
        console.log({ firebaseError });
        process.exit(1);
      });
  }).catch((axiosErr) => {
    console.log({ axiosErr });
    process.exit(1);
  });
} catch (err) {
  console.log({ err });
  process.exit(1);
}

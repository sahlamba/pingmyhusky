/* eslint-disable import/no-unresolved, no-console */
require('dotenv').config();
const fs = require('fs');

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./pingmyhusky-firebase-service-account-key.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

fs.readFile('tunnels.json', (fsError, data) => {
  if (fsError) {
    console.log({ fsError });
    process.exit(1);
  }

  let streamData;
  try {
    streamData = JSON.parse(data);
  } catch (jsonError) {
    console.log({ jsonError });
    streamData = {
      jsonError,
    };
  }
  streamData.lastUpdatedAt = new Date().toString();

  const database = firebaseAdmin.database();
  database
    .ref('/stream')
    .set(streamData)
    .then(() => {
      process.exit();
    })
    .catch((firebaseError) => {
      console.log({ firebaseError });
      process.exit(1);
    });
});

var admin = require("firebase-admin");
var serviceAccount = require("../app-coffeehouse-firebase-adminsdk-2dwwl-9613286b89.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;

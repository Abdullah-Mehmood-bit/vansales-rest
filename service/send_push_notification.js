const admin = require("firebase-admin");
const serviceAccount = require("../models/anjumhr-273513-firebase-adminsdk-cnf0t-c7052c97f8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anjumhr-273513.firebaseio.com"
});

const options = {
    priority: 'high',
    timeToLive: 60*60*24
}

function sendPushNotification(registrationToken, payload){
    admin.messaging().sendToDevice(registrationToken, payload, options)
    .then( response => {
        console.log('successfully sent message ', response)
    })
    .catch( err => {
        console.log('error occured ', error)
    })
}

module.exports = sendPushNotification
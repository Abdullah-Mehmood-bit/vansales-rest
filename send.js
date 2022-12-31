const admin = require("firebase-admin");

const serviceAccount = require("./models/anjumhr-273513-firebase-adminsdk-cnf0t-c7052c97f8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anjumhr-273513.firebaseio.com"
});

const registrationToken = "fn8TzXryS1qvC2Pv0rKeA0:APA91bFsI06B5rqgOzHQA1JRbf9WRKrIVe7qZsQe0bwewsZVaw-XDVJ8CE3HQN3_8hv88g6UeRRvR-OcOiLYtxGvSA_RNbNy5IYWJZqEoY90nRDArGtPKE_D8mBCmPLKW-2GGXgVT2F7"

const payload = {
    notification: {
      title: "Greet",
      body: "hello debashish"
    }
};

const options = {
    priority: 'high',
    timeToLive: 60*60*24
}

admin.messaging().sendToDevice(registrationToken, payload, options)
.then( response => {
    console.log('successfully sent message ', response)
})
.catch( err => {
    console.log('error occured ', error)
})
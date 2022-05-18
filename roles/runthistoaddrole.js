
var admin = require('firebase-admin');





var serviceAccount = require("./alhub-87b49-firebase-adminsdk-xuusx-d97f60dbad.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alhub-87b49-default-rtdb.firebaseio.com"
});


const auth = admin.auth();


const setClaims = async (email, claims) => {
  const user = await auth.getUserByEmail(email);
  auth.setCustomUserClaims(user.uid, claims);
};

// 👉 Call the setClaims function. Set the email and roles here.
setClaims("test@gmail.com", {
  roles: ["ADMIN"],
});

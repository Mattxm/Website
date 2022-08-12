import firebase from "firebase/app"

const fbConfig = {
    apiKey: "AIzaSyDW1hfoqP2TdoxWS9_mauO-3EGmP2KPnO8",
    authDomain: "beat-d4291.firebaseapp.com",
    projectId: "beat-d4291",
    storageBucket: "beat-d4291.appspot.com",
    messagingSenderId: "198057526075",
    appId: "1:198057526075:web:07e20e8f8772026cf52d1e",
    measurementId: "G-73ETXJF12Y"
  };

var fbApp = firebase.initializeApp(fbConfig);
export default fbApp
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCFmdzlwS56CjbdpN3FSO24DYOPk4LBXvQ",
  authDomain: "eccomerce-website.firebaseapp.com",
  projectId: "eccomerce-website",
  storageBucket: "eccomerce-website.appspot.com",
  messagingSenderId: "651202544558",
  appId: "1:651202544558:web:483d6589499d67b39efe3f",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

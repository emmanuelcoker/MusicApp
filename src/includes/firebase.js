import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkACOrNnCRkdIlGT2pkaebsM7-eYhrWeU",
  authDomain: "musicapp-38c80.firebaseapp.com",
  projectId: "musicapp-38c80",
  storageBucket: "musicapp-38c80.appspot.com",
  //   messagingSenderId: "499625991066",
  appId: "1:499625991066:web:cbaeae9376e0bb404a3823",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage,
};

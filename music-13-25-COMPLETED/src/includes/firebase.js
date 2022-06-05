import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCWdM35pKU_6svv4V13gk60Hc6LC8fLYOw',
  authDomain: 'music-16ade.firebaseapp.com',
  projectId: 'music-16ade',
  storageBucket: 'music-16ade.appspot.com',
  messagingSenderId: '639404663467',
  appId: '1:639404663467:web:77479c038a42c50c20cdee',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  storage,
};

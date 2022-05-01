// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWdM35pKU_6svv4V13gk60Hc6LC8fLYOw",
    authDomain: "music-16ade.firebaseapp.com",
    projectId: "music-16ade",
    storageBucket: "music-16ade.appspot.com",
    appId: "1:639404663467:web:77479c038a42c50c20cdee"
  };
  

export default firebase.initializeApp(firebaseConfig);
// Initialize Firebase
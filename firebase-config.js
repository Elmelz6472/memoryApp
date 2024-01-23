import { initializeApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyB2jJMhjEyJztOLJP5EefZL2YgJAUViS7M",
    authDomain: "memoryapp-fc002.firebaseapp.com",
    databaseURL: "https://memoryapp-fc002-default-rtdb.firebaseio.com",
    projectId: "memoryapp-fc002",
    storageBucket: "memoryapp-fc002.appspot.com",
    messagingSenderId: "1063019030446",
    appId: "1:1063019030446:web:bb54622cdac6321f170a3f",
    measurementId: "G-VWNR1Y8YJC"
};

const app = initializeApp(firebaseConfig);


export default app;
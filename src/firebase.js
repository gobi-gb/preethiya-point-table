
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
  databaseURL: "https://preethiya-point-table-default-rtdb.asia-southeast1.firebasedatabase.app/",
  apiKey: "AIzaSyB95iuhbU8yxi4cO-8nQpIZgT6VP3P-a3g",
  authDomain: "preethiya-point-table.firebaseapp.com",
  projectId: "preethiya-point-table",
  storageBucket: "preethiya-point-table.firebasestorage.app",
  messagingSenderId: "289465893461",
  appId: "1:289465893461:web:29098a00e87dc7be060adc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set };


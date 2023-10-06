// Web app Firebase configuration
import { initializeApp }from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
    apiKey: "AIzaSyCSBVqrIFxTFanbr8IHp2NxIlteXhHxF_Y",
    authDomain: "trektracker-app.firebaseapp.com",
    projectId: "trektracker-app",
    storageBucket: "trektracker-app.appspot.com",
    messagingSenderId: "227563687169",
    appId: "1:227563687169:web:8fac4ede27ac1e29c11f00"
  };

const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
// Web app Firebase configuration
import { initializeApp }from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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


// authentication
const auth = getAuth(firebaseApp)
let userUid = ''

onAuthStateChanged(auth, (user) => {
    if (user) {
        userUid = user.uid
    } else {
        userUid = ''
    }
})

export { auth, userUid }
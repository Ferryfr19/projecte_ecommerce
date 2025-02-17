import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
 
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAarW0_kIWgQjsWZp8bpxdaWy-UzB7_g4c",
    authDomain: "ecommerce-fb5aa.firebaseapp.com",
    projectId: "ecommerce-fb5aa",
    storageBucket: "ecommerce-fb5aa.firebasestorage.app",
    messagingSenderId: "804416341618",
    appId: "1:804416341618:web:c543ea86458f6177b824eb"
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

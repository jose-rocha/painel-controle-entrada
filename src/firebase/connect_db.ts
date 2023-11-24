// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs,
} from 'firebase/firestore';
import {
  getAuth,
  //  signOut,
} from 'firebase/auth';

import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDEuZjY3Ugoc2NCT3qSBEsrd45E7WRHF7U',
  authDomain: 'registro-entrada-a8bed.firebaseapp.com',
  projectId: 'registro-entrada-a8bed',
  storageBucket: 'registro-entrada-a8bed.appspot.com',
  messagingSenderId: '663094335400',
  appId: '1:663094335400:web:c55acfb96e78e1e001ef9d',
  measurementId: 'G-3G2FTE7BFG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

const getDataCollection = async () => {
  const turmaCollection = collection(db, 'ListaDeVisitantes');
  const turmaSnapshot = await getDocs(turmaCollection);
  const listTurma = turmaSnapshot.docs.map((docParams) => docParams.data());
  // console.log(auth);
  return listTurma;
};

export {
  getDataCollection,
  db,
  auth,
  storage,
};

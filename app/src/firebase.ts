import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  signInWithCustomToken as signIn,
  onAuthStateChanged as onAuthChanged,
  NextOrObserver,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection as firestoreCollection,
  doc as firestoreDoc,
  getDoc,
  onSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, httpsCallable as callable } from 'firebase/functions';
import { getStorage, connectStorageEmulator, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAm2FjysC_pxJpqwNbUsDu9icIg_H_SUJs',
  authDomain: 'daovatar.firebaseapp.com',
  projectId: 'daovatar',
  storageBucket: 'daovatar.appspot.com',
  messagingSenderId: '509581687894',
  appId: '1:509581687894:web:313949f00b50c02d698ff7',
  measurementId: 'G-QSVB1TDZ5C',
};

// eslint-disable-next-line
export namespace Firebase {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const functions = getFunctions(app);
  export const auth = getAuth(app);
  export const storage = getStorage(app);
  export const firestore = getFirestore(app);

  if (process.env.NODE_ENV === 'development') {
    connectFunctionsEmulator(functions, 'localhost', 5002);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFirestoreEmulator(firestore, 'localhost', 8082);
  }
}

export const httpsCallable = (name: string) => callable(Firebase.functions, name);
export const signInWithCustomToken = (token: string) => signIn(Firebase.auth, token);
export const storageRef = (path?: string) => ref(Firebase.storage, path);
export const onAuthStateChanged = (nextOrObserver: NextOrObserver<User>) =>
  onAuthChanged(Firebase.auth, nextOrObserver);
export { UserInfo } from 'firebase/auth';
export { uploadBytes, getDownloadURL } from 'firebase/storage';
export const collection = (name: string) => firestoreCollection(Firebase.firestore, name);
export const doc = (path: string) => getDoc(firestoreDoc(Firebase.firestore, path));
export const snapshot = <T>(collectionName: string, path: string, next: (_snap: DocumentSnapshot<T>) => void) =>
  // @ts-ignore
  // carlos: this complains about an overload that definitely exists...
  onSnapshot(firestoreDoc(Firebase.firestore, collectionName, path), { next });

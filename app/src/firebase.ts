import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, httpsCallable as callable } from 'firebase/functions';
import { getAuth, connectAuthEmulator, signInWithCustomToken as signIn, onAuthStateChanged as onAuthChanged, NextOrObserver, User } from 'firebase/auth';
import { getStorage, connectStorageEmulator, ref, uploadBytes as upload } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA7fqVE1VoM81x3bJfKOaH7tK0Ka8b9FvI",
  authDomain: "drop---avatars.firebaseapp.com",
  projectId: "drop---avatars",
  storageBucket: "drop---avatars.appspot.com",
  messagingSenderId: "297448976018",
  appId: "1:297448976018:web:5c49b68e6711ef06ae804b",
  measurementId: "G-ZMSMGXMDGX",
};

export namespace Firebase {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const functions = getFunctions(app);
  export const auth = getAuth(app);
  export const storage = getStorage(app);

  if (process.env.NODE_ENV === 'development') {
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
  }
}

export const httpsCallable = (name: string) => callable(Firebase.functions, name);
export const signInWithCustomToken = (token: string) => signIn(Firebase.auth, token);
export const storageRef = (path?: string) => ref(Firebase.storage, path);
export const onAuthStateChanged = (nextOrObserver: NextOrObserver<User>) => onAuthChanged(Firebase.auth, nextOrObserver);
export const uploadBytes = upload;


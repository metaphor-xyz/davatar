import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { registerRootComponent } from 'expo';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyA7fqVE1VoM81x3bJfKOaH7tK0Ka8b9FvI",
  authDomain: "drop---avatars.firebaseapp.com",
  projectId: "drop---avatars",
  storageBucket: "drop---avatars.appspot.com",
  messagingSenderId: "297448976018",
  appId: "1:297448976018:web:5c49b68e6711ef06ae804b",
  measurementId: "G-ZMSMGXMDGX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV === 'development') {
  firebase.functions().useEmulator('localhost', 5001);
  firebase.auth().useEmulator('http://localhost:9099');
}

function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default registerRootComponent(App);


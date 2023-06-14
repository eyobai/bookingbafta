import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import firebase from "@react-native-firebase/app";
import { initializeApp } from "firebase/app";
import "@react-native-firebase/auth";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  // Replace with your Firebase project's configuration object
  apiKey: "AIzaSyCujg142JHu-h9i68_zS5b4Wt-466u1xmM",
  authDomain: "gizeye-20fa5.firebaseapp.com",
  projectId: "gizeye-20fa5",
  storageBucket: "gizeye-20fa5.appspot.com",
  messagingSenderId: "29032338202",
  appId: "1:29032338202:web:bc79107d3a2b8965ac12a3",
  measurementId: "G-CJRE4ZYMWV",
};

// Check if Firebase is already initialized
initializeApp(firebaseConfig);

const SignupComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSignup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userInfo) => {
        console.log(userInfo);
        const user = firebase.auth().currentUser;

        // Update user profile with displayName
        user
          .updateProfile({
            displayName: displayName.trim(),
          })
          .then(() => {
            console.log("User profile updated successfully");
            // Additional actions after successful signup
          })
          .catch((error) => {
            console.log("Failed to update user profile:", error);
          });
      })
      .catch((error) => {
        console.log("Failed to create user:", error);
      });
  };

  return (
    <View style={{ marginTop: 100 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        placeholder="Display Name"
        onChangeText={setDisplayName}
        value={displayName}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

export default SignupComponent;

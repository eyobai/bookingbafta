import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../firebase.config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc, set } from "firebase/firestore";
import BusinessCategory from "./BusinessCategory";
const RegisterScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const app = initializeApp(firebaseConfig);

  const firestore = getFirestore();

  const handleRegister = async () => {
    setLoading(true);
    const auth = getAuth();
    const db = getFirestore(app);
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // Check if the email matches the regular expression
    if (!emailRegex.test(email)) {
      setErrorMessage("email is not correct");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User registration successful
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        setUserId(user.uid);
        // Save the user's email in Firestore
        setDoc(userDocRef, { email, phone, businessName, name })
          .then(() => {
            console.log("User registered and email saved in Firestore:", user);
        
          })
          .catch((error) => {
            console.error("Error saving email in Firestore:", error);
          })
          .finally(() => {
            setLoading(false);
          });
          navigation.navigate("BusinessCategory", { userId: user.uid });

      })
      .catch((error) => {
        console.error("Error registering user:", error);
        setLoading(false);
      });
  };
  const AlreadyRegistered = () => {
    //send user id to business category
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/bafta_logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Create an account</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry={true}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.RegisterBtn} onPress={handleRegister}>
          <Text style={styles.RegisterText}>NEXT</Text>
        </TouchableOpacity>
        <Text style={styles.alreadyRegisteredText}>
          already have account?
          <TouchableOpacity onPress={AlreadyRegistered}>
            <Text style={styles.noteRegisteredLink}> Login</Text>
          </TouchableOpacity>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginVertical: 8,
    alignSelf: "center",
    width: "80%",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  alreadyRegisteredText: {
    color: "black",
    marginTop: 24,
    fontSize: 16,
  },
  noteRegisteredLink: {
    color: "#003f5c",
    fontWeight: "bold",
    fontSize: 19,
  },
  RegisterBtn: {
    width: "100%",
    backgroundColor: "#069BA4",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  RegisterText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;

import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import useInternetConnectivity from "../../components/useInternetConnectivity";
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
  ActivityIndicator,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseConfig } from "../../firebase.config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  set,
} from "firebase/firestore";
import { setUserId } from "../../redux/store";
import * as Location from 'expo-location';

const RegisterScreen = ({ setUserId }) => {
  const navigation = useNavigation();
  const { showBanner } = useInternetConnectivity();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore();

  const handleRegister = async () => {
    const auth = getAuth();
    const db = getFirestore(app);

    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      setIsLoading(false); // Set loading state to false
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false); // Set loading state to false
      return;
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // Check if the email matches the regular expression
    if (!emailRegex.test(email)) {
      setErrorMessage("Email is not correct");
      setIsLoading(false); // Set loading state to false
      return;
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // User registration successful
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        setUserId(user.uid); // Dispatch the action to update the userId in Redux store

       
     

        // Save the user's email, location, and other details in Firestore
        setDoc(userDocRef, { email, phone, businessName, name })
          .then(() => {
            console.log("User registered and data saved in Firestore:", user);
          })
          .catch((error) => {
            console.error("Error saving data in Firestore:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });

        navigation.navigate("BusinessCategory");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        setIsLoading(false);
        if (error.code === "auth/email-already-in-use") {
          Alert.alert(
            "User Already Exists",
            "The email address is already registered. Please login instead.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("SignIn"),
              },
            ]
          );
        } else {
          Alert.alert(
            "Registration Error",
            "An error occurred during registration. Please try again later."
          );
        }
      });
  };

  const AlreadyRegistered = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/bafta_logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Create an account</Text>
      </View>
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
        <TouchableOpacity
          style={styles.RegisterBtn}
          onPress={handleRegister}
          disabled={isLoading} // Disable the button when loading is true
        >
          {/* Show different text based on the loading state */}
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.RegisterText}>NEXT</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.alreadyRegisteredText}>
          already have an account?
          <TouchableOpacity onPress={AlreadyRegistered}>
            <Text style={styles.noteRegisteredLink}> Login</Text>
          </TouchableOpacity>
        </Text>
      </ScrollView>
      {showBanner && (
        <View style={isConnected ? styles.restoredBanner : styles.disconnectedBanner}>
          <Text style={styles.bannerText}>
            {isConnected ? "Internet Restored" : "Not Connected to the Internet"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  bannerContainer: {
    backgroundColor: "green",
    paddingVertical: 10,
    alignItems: "center",
  },
  bannerText: {
    color: "white",
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: -50,
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
    marginTop: 4,
    fontSize: 19,
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

const mapDispatchToProps = (dispatch) => {
  return {
    setUserId: (userId) => dispatch(setUserId(userId)),
  };
};

export default connect(null, mapDispatchToProps)(RegisterScreen);

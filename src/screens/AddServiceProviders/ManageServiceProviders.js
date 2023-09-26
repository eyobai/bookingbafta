import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../firebase.config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  set,
  getDoc,
} from "firebase/firestore";
import employeeIdReducer, { setEmployeeId } from "../../redux/employeeStore";
import * as Location from "expo-location";

const RegisterScreen = ({ setEmployeeId }) => {
  const navigation = useNavigation();
  const { showBanner } = useInternetConnectivity();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const adminId = useSelector((state) => state.user.userId);

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore();

  // ...

  const handleRegister = async () => {
    const auth = getAuth();
    const db = getFirestore(app);

    setIsLoading(true);

    // Create a new employee user with email and password
    const employeeCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const serviceProviderId = employeeCredential.user.uid;
    console.log(`employee id ${serviceProviderId}`);
    // Create a reference to the user's Firestore document using their ID
    const userDocRef = doc(db, "users", adminId);

    // Fetch the existing data in the document
    const userDocSnapshot = await getDoc(userDocRef);

    // Get the current data or initialize an empty object if it doesn't exist
    const existingUserData = userDocSnapshot.exists()
      ? userDocSnapshot.data()
      : {};

    // Get the current employees array or initialize an empty array if it doesn't exist
    const existingEmployees = existingUserData.employees || [];

    // Create a new employee object
    const newEmployee = {
      email,
      phone,
      name,
      serviceProviderId,
      // Add any other employee data you want to store here
    };

    // Merge the new employee data with the existing employees array
    const updatedEmployees = [...existingEmployees, newEmployee];

    // Update the Firestore document with the updated employees array
    setDoc(userDocRef, { ...existingUserData, employees: updatedEmployees })
      .then(() => {
        console.log("User registered and employee data saved in Firestore:");
      })
      .catch((error) => {
        console.error("Error saving data in Firestore:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    setEmployeeId(serviceProviderId); // Dispatch the action to update the userId in Redux store
    navigation.navigate("workingHours");
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
        <Text style={styles.title}>Service Provider account</Text>
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
        <View
          style={
            isConnected ? styles.restoredBanner : styles.disconnectedBanner
          }
        >
          <Text style={styles.bannerText}>
            {isConnected
              ? "Internet Restored"
              : "Not Connected to the Internet"}
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
    setEmployeeId: (userId) => dispatch(setEmployeeId(userId)),
  };
};

export default connect(null, mapDispatchToProps)(RegisterScreen);

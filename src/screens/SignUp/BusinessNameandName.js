import React, { useState } from "react";
import { useSelector } from "react-redux";
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
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

function BusinessNameandName() {
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const { showBanner } = useInternetConnectivity();
  // const userId = useSelector((state) => state.user.userId);'
  const userId = "W2H3CAZTiSbD0dCgqCVeQTkhrYH3";
  const [businessName, setBusinessName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    console.log(userId);
    if (!businessName || !name) {
      setErrorMessage("Please fill in both Business Name and Name fields.");
      return;
    }
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const location = {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      };
      console.log(name, businessName, location);
      // Make a POST request to your Express.js API to store user information
      const response = await axios.post(`http://localhost:3001/register/1234`, {
        name,
        businessName,
        location,
      });

      // Check the response and handle success/failure as needed
      if (response.status === 201) {
        console.log("User information stored successfully");
        navigation.navigate("BusinessCategory");
      } else {
        console.error("Failed to store user information");
        // Handle the failure case, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const AlreadyRegistered = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/bafta_logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Create an account</Text>
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
      <TouchableOpacity onPress={handleRegister} style={styles.RegisterBtn}>
        <Text style={styles.RegisterText}>NEXT</Text>
      </TouchableOpacity>
      <Text style={styles.alreadyRegisteredText}>
        already have an account?
        <TouchableOpacity onPress={AlreadyRegistered}>
          <Text style={styles.noteRegisteredLink}> Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 170,
    height: 170,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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

export default BusinessNameandName;

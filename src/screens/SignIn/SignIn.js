import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../firebase.config";
import { initializeApp } from "firebase/app";

const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const handleLogin = async () => {
    try {
      // Handle login logic here
      await signInWithEmailAndPassword(auth, email, password);

      // Save user login status to AsyncStorage
      await AsyncStorage.setItem("isLoggedIn", "true");

      console.log("Signed in successfully");
      navigation.reset({
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      console.log(error);
    }
    console.log(`email is ${email} and password is ${password}`);
    navigation.reset({
      routes: [{ name: "MainTab" }],
    });
  };
  const notRegisterd = () => {
    navigation.navigate("AboutYou");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/bafta_logo.png")}
        style={styles.logo}
      />
      <View style={styles.inputView}>
        <Icon name="envelope-o" size={20} color="#003f5c" style={styles.icon} />
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <Icon name="lock" size={20} color="#003f5c" style={styles.icon} />
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        Not registered yet?{" "}
        <TouchableOpacity onPress={notRegisterd}>
          <Text style={styles.registerLink}>Register here</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 75,
  },
  inputContainer: {
    flex: 2,
    backgroundColor: "#f2f2f2",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    height: 50,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  inputText: {
    height: 50,
    color: "black",
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#069BA4",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    padding: 10,
  },
  registerText: {
    color: "black",
    marginTop: 24,
    fontSize: 16,
  },
  registerLink: {
    color: "#003f5c",
    fontWeight: "bold",
  },
});
export default SignIn;

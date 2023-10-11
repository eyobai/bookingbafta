import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import fbConfig from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

try {
  initializeApp(fbConfig);
} catch (error) {
  console.log("Initializing error", error);
}

const auth = getAuth();
function RegisterScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationID] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [info, setInfo] = useState("");
  const [resendActive, setResendActive] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds (1 minute)

  // Define recaptchaVerifier using useRef
  const recaptchaVerifier = useRef(null);

  const handleSendVerificationCode = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationID(verificationId);
      setInfo("Success: Verification code has been sent to your phone");

      // Activate the resend button and start the timer
      setResendActive(true);
      const interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // After 1 minute (60 seconds), deactivate the resend button
      setTimeout(() => {
        setResendActive(false);
        clearInterval(interval); // Clear the timer interval
        setResendTimer(60); // Reset the timer
      }, 60000);
    } catch (error) {
      setInfo(`Error: ${error.message}`);
    }
  };

  const handleVerifyVerificationCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      await signInWithCredential(auth, credential);
      setInfo("Success: Phone authentication successful");
      navigation.navigate("Home");
    } catch (error) {
      setInfo(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (resendActive) {
      if (resendTimer <= 0) {
        setResendActive(false);
        setResendTimer(60); // Reset the timer
      }
    }
  }, [resendActive, resendTimer]);

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={fbConfig}
      />

      {info && <Text style={styles.text}>{info}</Text>}

      {!verificationId && (
        <View>
          <Text style={styles.text}>Enter the phone number</Text>

          <TextInput
            placeholder="+2547000000"
            autoFocus
            autoCompleteType="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />

          <Button
            onPress={() => handleSendVerificationCode()}
            title="Send Verification Code"
            disabled={!phoneNumber || resendActive}
          />
        </View>
      )}

      {verificationId && (
        <View>
          <Text style={styles.text}>Enter the verification code</Text>

          <TextInput
            editable={!!verificationId}
            placeholder="123456"
            onChangeText={setVerificationCode}
          />

          <Button
            title="Confirm Verification Code"
            disabled={!verificationCode}
            onPress={() => handleVerifyVerificationCode()}
          />

          {resendActive ? (
            <Button title={`Resend Code in ${resendTimer} seconds`} disabled />
          ) : (
            <Button
              title="Resend Verification Code"
              onPress={() => handleSendVerificationCode()}
            />
          )}
        </View>
      )}

      <FirebaseRecaptchaBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#aaa",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RegisterScreen;

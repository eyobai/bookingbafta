import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import COLORS from "../consts/colors";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserId } from "../redux/store";
import { connect } from "react-redux";
import { useState } from "react";

const LoadingScreen = ({ loadingText = "Loading...", setUserId }) => {
  const navigation = useNavigation();
  useEffect(() => {
    checkUserLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        navigation.navigate("Main");
      } else if (!isLoggedIn) {
        navigation.navigate("SignIn");
      }
    });
  }, []);
  const checkUserLoggedIn = async () => {
    // Check if the user is logged in, e.g., by checking if a user ID is in AsyncStorage.
    const userId = await AsyncStorage.getItem("userId");
    setUserId(userId);

    return !!userId; // Return true if a user ID is found, indicating the user is logged in.
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUserId: (myuserid) => dispatch(setUserId(myuserid)), // Dispatch the action
  };
};

export default connect(null, mapDispatchToProps)(LoadingScreen);

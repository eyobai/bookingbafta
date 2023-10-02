import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoadingScreen = ({ loadingText = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>{loadingText}</Text>
    </View>
  );
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

export default LoadingScreen;

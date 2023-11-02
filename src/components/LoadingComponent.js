import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import COLORS from "../consts/colors";

const LoadingComponent = ({ loadingText = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
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

export default LoadingComponent;

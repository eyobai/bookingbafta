// DetailsScreen.js
import React from "react";
import { View, Text, Button } from "react-native";

const DetailsScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome to the Details Screen!</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DetailsScreen;

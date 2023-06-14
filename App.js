import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./src/Stack/MainStack";

const App = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;

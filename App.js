import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import MainStack from "./src/Stack/MainStack";
import { Provider } from "react-redux";
import userIdReducer from "./src/redux/store";
import userReducer from "./src/redux/serviceProviderStore";
import employeeIdReducer from "./src/redux/employeeStore";
import { combineReducers, createStore } from "redux";
import workingHoursReducer from "./src/redux/workingHourStore";
import { LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingComponent from "./src/components/LoadingComponent";
import LoggedInStack from "./src/Stack/LoggedInStack";
import COLORS from "./src/consts/colors";
LogBox.ignoreAllLogs();

const rootReducer = combineReducers({
  user: userIdReducer,
  serviceProvider: userReducer,
  workingHour: workingHoursReducer,
  employee: employeeIdReducer,
});
const rootStore = createStore(rootReducer);
const App = () => {
  const [initialRoute, setInitialRoute] = useState();

  useEffect(() => {
    checkUserLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        setInitialRoute("Main");
      } else {
        setInitialRoute("SignIn");
      }
    });
  }, []);
  const checkUserLoggedIn = async () => {
    // Check if the user is logged in, e.g., by checking if a user ID is in AsyncStorage.
    const userId = await AsyncStorage.getItem("userId");
    return !!userId; // Return true if a user ID is found, indicating the user is logged in.
  };

  return (
    <Provider store={rootStore}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.orange}
        translucent={true}
      />
      <NavigationContainer>
        {initialRoute === "SignIn" ? <MainStack /> : <LoggedInStack />}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

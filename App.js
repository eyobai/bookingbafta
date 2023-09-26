import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./src/Stack/MainStack";
import { Provider } from "react-redux";
import userIdReducer from "./src/redux/store";
import userReducer from "./src/redux/serviceProviderStore";
import employeeIdReducer from "./src/redux/employeeStore";
import { combineReducers, createStore } from "redux";
import workingHoursReducer from "./src/redux/workingHourStore";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const rootReducer = combineReducers({
  user: userIdReducer,
  serviceProvider: userReducer,
  workingHour: workingHoursReducer,
  employee: employeeIdReducer,
});
const rootStore = createStore(rootReducer);
const App = () => {
  return (
    <Provider store={rootStore}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

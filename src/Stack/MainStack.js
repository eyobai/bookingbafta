import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
// Import your screen components
import Home from "../screens/Home/Home";
import Search from "../screens/Search/Search";
import Appointments from "../screens/Appointments/Appointments";
import Favorites from "../screens/Favorites/Favorites";
import Profile from "../screens/Profile/Profile";

import Preload from "../screens/Preload/Preload";
import SignIn from "../screens/SignIn/SignIn";
import AboutYou from "../screens/SignUp/AboutYou";
import BusinessCategory from "../screens/SignUp/BusinessCategory";
import Services from "../screens/SignUp/RegisterService";
import DayList from "../screens/DayList/DayList";
import UploadImage from "../screens/ImageUpload/ImageUpload";
import WorkingHours from "../screens/WorkingHours/WorkingHours";
import Congratulations from "../screens/FinalPage/FinalPage";
// Create a stack navigator

const Stack = createNativeStackNavigator();
// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Map each route name to a corresponding icon
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Search":
              iconName = "search";
              break;
            case "Appointments":
              iconName = "event";
              break;
            case "Favorites":
              iconName = "favorite";
              break;
            case "Profile":
              iconName = "person";
              break;
            default:
              iconName = "home";
              break;
          }

          // Render the icon using the Icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarItemStyle: { justifyContent: "center", alignItems: "center" },
        tabBarActiveTintColor: "#069BA4",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Preload"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Preload"
        component={Preload}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="AboutYou" component={AboutYou} />
      <Stack.Screen name="BusinessCategory" component={BusinessCategory} />
      <Stack.Screen name="Services" component={Services} />
      <Stack.Screen name="DayList" component={DayList} />
      <Stack.Screen name="ImageUpload" component={UploadImage}/>
      <Stack.Screen name="WorkingHour" component={WorkingHours}/>
      <Stack.Screen name="Congratulations" component={Congratulations}/>
      <Stack.Screen name="Main" component={MainTab} />
    </Stack.Navigator>
  );
};

export default MainStack;

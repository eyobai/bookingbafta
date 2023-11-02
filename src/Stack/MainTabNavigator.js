import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import Home from "../screens/Home/Home";
import Search from "../screens/Search/Search";
import Appointments from "../screens/Appointments/Appointments";
import Setting from "../screens/Setting/Setting";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Appointments"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Clients":
              iconName = "groups";
              break;
            case "Notification":
              iconName = "notifications";
              break;
            case "Appointments":
              iconName = "event";
              break;
            case "Setting":
              iconName = "settings";
              break;
            default:
              iconName = "home";
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarItemStyle: { justifyContent: "center", alignItems: "center" },
        tabBarActiveTintColor: "#069BA4",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen name="Clients" component={Home} />
      <Tab.Screen name="Notification" component={Search} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

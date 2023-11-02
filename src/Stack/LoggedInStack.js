import React, { useEffect, useState } from "react";
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
import Setting from "../screens/Setting/Setting";

import Preload from "../screens/Preload/Preload";
import SignIn from "../screens/SignIn/SignIn";
import AboutYou from "../screens/SignUp/AboutYou";
import BusinessCategory from "../screens/SignUp/BusinessCategory";
import Services from "../screens/SignUp/RegisterService";
import DayList from "../screens/DayList/DayList";
import UploadImage from "../screens/ImageUpload/ImageUpload";
import Congratulations from "../screens/FinalPage/FinalPage";
import ManageServiceProviders from "../screens/AddServiceProviders/ManageServiceProviders";
import RegisterbyPhoneNumber from "../screens/SignUp/RegisterbyPhoneNumber";
// Create a stack navigator
import AddressForm from "../screens/AddressForm";
import DisplayAddress from "../screens/DisplayAddress";
import ServiceProviderHours from "../screens/AddServiceProviders/ServiceProvidersHours";
import ServiceProviderImageUpload from "../screens/AddServiceProviders/ServiceProviderImageUpload";
import ServiceSetup from "../screens/ServiceSetup/ServiceSetup";
import { connect } from "react-redux";
import { setUserId } from "../redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingComponent from "../components/LoadingComponent";
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
            case "Clients":
              iconName = "groups";
              break;
            case "Notification":
              iconName = "notifications";
              break;
            case "Appointments":
              iconName = "event";
              break;
            case "Favorites":
              iconName = "favorite";
              break;
            case "Setting":
              iconName = "settings";
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
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen name="Clients" component={Home} />
      <Tab.Screen name="Notification" component={Search} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
};

const LoggedInStack = ({ setUserId }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  const checkUserLoggedIn = async () => {
    try {
      // Check if the user is logged in by retrieving the user ID from AsyncStorage.
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        // Dispatch the user ID to the Redux store if it exists.
        setUserId(userId);
      }
    } catch (error) {
      console.error("Error checking user login:", error);
    } finally {
      setLoading(false); // Set loading to false when the check is complete
    }
    if (loading) {
      // You can return a loading indicator or a blank screen while checking the user login.
      return <LoadingComponent />; // Replace LoadingComponent with your actual loading component.
    }
  };
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />

      <Stack.Screen name="Main" component={MainTab} />

      <Stack.Screen name="AboutYou" component={AboutYou} />

      <Stack.Screen
        name="Preload"
        component={Preload}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="BusinessCategory" component={BusinessCategory} />
      <Stack.Screen name="Services" component={Services} />
      <Stack.Screen name="DayList" component={DayList} />
      <Stack.Screen name="ImageUpload" component={UploadImage} />

      <Stack.Screen name="Congratulations" component={Congratulations} />
      {/* setting screens */}
      <Stack.Screen
        name="ManageServiceProviders"
        component={ManageServiceProviders}
      />

      <Stack.Screen name="AddressForm" component={AddressForm} />
      <Stack.Screen name="displayaddress" component={DisplayAddress} />
      <Stack.Screen name="workingHours" component={ServiceProviderHours} />
      <Stack.Screen
        name="serviceProvidersImageUpload"
        component={ServiceProviderImageUpload}
      />
      <Stack.Screen name="serviceSetup" component={ServiceSetup} />
      <Stack.Screen
        name="RegisterbyPhoneNumber"
        component={RegisterbyPhoneNumber}
      />
    </Stack.Navigator>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserId: (myuserid) => dispatch(setUserId(myuserid)), // Dispatch the action
  };
};

export default connect(null, mapDispatchToProps)(LoggedInStack);

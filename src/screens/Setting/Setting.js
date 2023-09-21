import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you have installed the @expo/vector-icons package

const menus = [
  {
    title: "Manage Service Providers",
    goTo:"ManageServiceProviders",
    description: "Manage your salon service providers",
    icon: "people",
  },
  {
    title: "Service Setup",
    goTo: "serviceSetup",
    description: "Set up and customize your salon services",
    icon: "cog",
  },
  {
    title: "Schedule Management",
    description: "Manage your salon appointment schedules",
    icon: "calendar",
  },
  {
    title: "Payment & Checkout",
    description: "Configure payment and checkout options",
    icon: "card",
  },
  {
    title: "Subscription & Billing",
    description: "Manage subscriptions and billing information",
    icon: "cash",
  },
  {
    title: "Gift Cards",
    description: "Manage gift cards for your salon",
    icon: "gift",
  },
  {
    title: "Sign Out",
    description: "Sign out of your account",
    icon: "exit",
  },
];

function SettingScreen({ navigation }) {
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate("SignIn"), // Replace "SignIn" with the appropriate screen name
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting Screen</Text>
      {menus.map((menu, index) => (
        <TouchableOpacity
          style={styles.menuItem}
          key={index}
         onPress={() => (menu.title === "Sign Out" ? handleSignOut() : navigation.navigate(menu.goTo))}
        >
          <View style={styles.menuItemInner}>
            <Ionicons
              name={menu.icon}
              size={24}
              color="#555"
              style={styles.menuIcon}
            />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>{menu.title}</Text>
              <Text style={styles.menuDescription}>{menu.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  menuItemInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuDescription: {
    fontSize: 14,
    color: "#888",
  },
});

export default SettingScreen;

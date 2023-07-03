import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you have installed the @expo/vector-icons package

const menus = [
  {
    title: "ManageServiceProviders",
    description: "Manage your salon service providers",
    icon: "people",
  },
  {
    title: "Service Setup",
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
];

function SettingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting Screen</Text>
      {menus.map((menu, index) => (
        <TouchableOpacity
          style={styles.menuItem}
          key={index}
          onPress={() => navigation.navigate(menu.title)}
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
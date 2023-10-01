import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ServiceProviderDashboard = () => {
  const generateGridItems = () => {
    const rows = 2;
    const columns = 2;
    const gridItems = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = [];
      for (let j = 0; j < columns; j++) {
        const itemContent = (
          <View key={`item-${i}-${j}`} style={styles.gridItem}>
            <Text>Grid Item {i * columns + j + 1}</Text>
            {/* Add your content here, e.g., service provider details */}
          </View>
        );
        rowItems.push(itemContent);
      }
      gridItems.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          {rowItems}
        </View>
      );
    }

    return gridItems;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF6B6B", "#6B6BFF"]} // Set your preferred gradient colors
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome</Text>
        </View>
      </LinearGradient>
      {generateGridItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  gradientBackground: {
    flex: 1,
    flexDirection: "row", // Ensure gradient covers the entire left side
    justifyContent: "flex-start", // Align the gradient to the left
    alignItems: "center",
  },
  header: {
    flex: 1,
    padding: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  gridRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
});
export default ServiceProviderDashboard;

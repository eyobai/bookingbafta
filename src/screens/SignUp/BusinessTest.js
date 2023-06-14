import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
//firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase.config";
import { getFirestore, collection, setDoc, doc, set } from "firebase/firestore";

const ListItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BusinessCategory = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const route = useRoute();
  const data = route.params?.userId;

  const [selectedItem, setSelectedItem] = useState("");
  const items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
  ];
  const navigation = useNavigation();
  const handleItemPress = (item) => {
    setSelectedItem(item);
    // You can perform additional actions with the selected item here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="black" />
          <Text>Choose Your Business Categorys {data}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {items.map((item, index) => (
          <ListItem key={index} item={item} onPress={handleItemPress} />
        ))}
      </ScrollView>
      <View style={styles.selectedItemContainer}>
        <Text>Selected Item: {selectedItem}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  selectedItemContainer: {
    padding: 10,
  },
});

export default BusinessCategory;

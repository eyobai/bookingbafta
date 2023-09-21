import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../../firebase.config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const OptionsList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = useSelector((state) => state.user.userId);

  const [businesscategories, setbusinesscategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchbusinesscategories();
  }, []);

  // Function to fetch selected options from AsyncStorage
  const fetchbusinesscategories = async () => {
    try {
      if (!userId) {
        console.error("User ID is missing.");
        return;
      }
      console.log("userId:", userId);
      const optionsKey = `users/${userId}/options`;
      const optionsData = await AsyncStorage.getItem(optionsKey);

      if (optionsData) {
        const latestOptions = JSON.parse(optionsData).businesscategories;
        setbusinesscategories(latestOptions);
      }
    } catch (error) {
      console.error("Error fetching selected options:", error);
    }
  };

  // Function to handle option press and update selected options
  const handleOptionPress = (option) => {
    const updatedOptions = businesscategories.includes(option)
      ? businesscategories.filter((item) => item !== option)
      : [...businesscategories, option];

    setbusinesscategories(updatedOptions);
  };

  // Function to save options to user's document in Firestore
  const handleSaveOptions = async () => {
    setIsLoading(true);

    try {
      if (!userId) {
        console.error("User ID is missing.");
        return;
      }

      // Reference the user's document in the 'users' collection
      const userDocRef = doc(db, "users", userId);

      // Get the user document data
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Update the user's document with the selected options
        await updateDoc(userDocRef, {
          businesscategories,
        });

        console.log("Options saved successfully!");
        navigation.navigate("Services");
      } else {
        console.error("User document not found.");
      }
    } catch (error) {
      console.error("Error storing business category", error);
    }

    setIsLoading(false);
  };

  const options = [
    "Barbershop",
    "Day Spa",
    "Eyebrows & Lashes",
    "Hair Removal",
    "Hair Salon",
    "Health and Wellness",
    "Makeup Artist",
    "Massage",
    "Nail Salon",
    "Personal Trainer",
    "Skin Care",
    "Tattoo Shops",
    "Wedding Makeup Artist",
    "Other",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.pageName}>Options List</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleOptionPress(option)}
            style={[
              styles.optionItem,
              businesscategories.includes(option) && styles.businessCategory,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                businesscategories.includes(option) &&
                  styles.businessCategoryText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleSaveOptions}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.nextText}>Next</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  optionItem: {
    backgroundColor: "white",
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  businessCategory: {
    backgroundColor: "#282534",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  businessCategoryText: {
    color: "white",
  },
  nextBtn: {
    width: "90%",
    backgroundColor: "#069BA4",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OptionsList;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../firebase.config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const OptionsList = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    fetchSelectedOptions();
  }, []);

  const fetchSelectedOptions = async () => {
    try {
      const optionsRef = collection(db, "options");
      const optionsSnapshot = await getDocs(
        query(optionsRef, orderBy("timestamp", "desc"), limit(1))
      );

      if (!optionsSnapshot.empty) {
        const latestOptions = optionsSnapshot.docs[0].data().selectedOptions;
        setSelectedOptions(latestOptions);
      }
    } catch (error) {
      console.error("Error fetching selected options:", error);
    }
  };

  const handleOptionPress = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedOptions);
  };

  const handleSaveOptions = async () => {
    try {
      const optionsRef = collection(db, "options");
      const newOptions = {
        selectedOptions,
        timestamp: Date.now(),
      };
      await addDoc(optionsRef, newOptions);
      console.log("Options saved successfully!");
    } catch (error) {
      console.error("Error saving options:", error);
    }
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
              selectedOptions.includes(option) && styles.selectedOption,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedOptions.includes(option) && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.nextBtn} onPress={handleSaveOptions}>
          <Text style={styles.nextText}>Next</Text>
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
  selectedOption: {
    backgroundColor: "#282534",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedOptionText: {
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

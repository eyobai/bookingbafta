import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleOptionPress(option)}
          style={{
            backgroundColor: selectedOptions.includes(option)
              ? "green"
              : "white",
            padding: 10,
            margin: 5,
          }}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={handleSaveOptions}
        style={{ backgroundColor: "blue", padding: 10, margin: 5 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Save Options
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OptionsList;

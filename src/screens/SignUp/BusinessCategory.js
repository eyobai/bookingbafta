import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Updated import for AsyncStorage
import { firebaseConfig } from '../../firebase.config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const OptionsList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = useSelector((state) => state.userId);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSelectedOptions();
  }, []);

  // Function to fetch selected options from AsyncStorage
  const fetchSelectedOptions = async () => {
    try {
      if (!userId) {
        console.error('User ID is missing.');
        return;
      }
      console.log('userId:', userId);
      const optionsKey = `users/${userId}/options`;
      const optionsData = await AsyncStorage.getItem(optionsKey);

      if (optionsData) {
        const latestOptions = JSON.parse(optionsData).selectedOptions;
        setSelectedOptions(latestOptions);
      }
    } catch (error) {
      console.error('Error fetching selected options:', error);
    }
  };

  // Function to handle option press and update selected options
  const handleOptionPress = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedOptions);
  };

  // Function to save options to AsyncStorage
  const handleSaveOptions = async () => {
    setIsLoading(true);

    try {
      if (!userId) {
        console.error('User ID is missing.');
        return;
      }
      const optionsKey = `users/${userId}/options`;
      const newOptions = {
        selectedOptions,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(optionsKey, JSON.stringify(newOptions));
      console.log('Options saved successfully!');
      navigation.navigate('Services');
    } catch (error) {
      console.error('Error saving options:', error);
    }

    setIsLoading(false);
  };

  const options = [
    'Barbershop',
    'Day Spa',
    'Eyebrows & Lashes',
    'Hair Removal',
    'Hair Salon',
    'Health and Wellness',
    'Makeup Artist',
    'Massage',
    'Nail Salon',
    'Personal Trainer',
    'Skin Care',
    'Tattoo Shops',
    'Wedding Makeup Artist',
    'Other',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  optionItem: {
    backgroundColor: 'white',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#282534',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  nextBtn: {
    width: '90%',
    backgroundColor: '#069BA4',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OptionsList;

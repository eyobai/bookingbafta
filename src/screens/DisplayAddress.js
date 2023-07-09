import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase.config';
import { initializeApp } from 'firebase/app';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db= getFirestore(app);

const DisplayUsers = () => {
  const userData = useSelector((state) => state.serviceProvider.userData);

  // Function to store the user data in Firestore
  const storeUserDataInFirestore = async () => {
    try {
      const usersCollectionRef = collection(db, 'serviceprovidersusers');
      await addDoc(usersCollectionRef, userData);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  useEffect(() => {
    // Call the function to store the user data in Firestore
    storeUserDataInFirestore();
  }, []);

  return (
    <View>
      <Text>User Data:</Text>
      {userData && (
        <View>
          <Text>First Name: {userData.firstName}</Text>
          <Text>Last Name: {userData.lastName}</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Password: {userData.password}</Text>
        </View>
      )}
    </View>
  );
};

export default DisplayUsers;

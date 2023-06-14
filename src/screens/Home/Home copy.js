import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll } from "firebase/storage";

import firebase from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyCujg142JHu-h9i68_zS5b4Wt-466u1xmM",
  authDomain: "gizeye-20fa5.firebaseapp.com",
  projectId: "gizeye-20fa5",
  storageBucket: "gizeye-20fa5.appspot.com",
  messagingSenderId: "29032338202",
  appId: "1:29032338202:web:bc79107d3a2b8965ac12a3",
  measurementId: "G-CJRE4ZYMWV",
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage();

const Home = () => {
  const [serviceName, setServiceName] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [ServiceProvider, setServiceProvider] = useState("");
  const handleAddService = async () => {
    // Create a new document in the 'services' collection

    try {
      const docRef = await addDoc(collection(db, ServiceProvider), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // db.collection("services")
    //   .add({
    //     name: serviceName,
    //     duration: serviceDuration,
    //     price: servicePrice,
    //   })
    //   .then(() => {
    //     console.log("Service added successfully");
    //     // Clear the input fields
    //     setServiceName("");
    //     setServiceDuration("");
    //     setServicePrice("");
    //   })
    //   .catch((error) => {
    //     console.log("Error adding service:", error);
    //   });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Add Service</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Service Name"
        value={ServiceProvider}
        onChangeText={setServiceProvider}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Service Name"
        value={serviceName}
        onChangeText={setServiceName}
      />

      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Duration"
        value={serviceDuration}
        onChangeText={setServiceDuration}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Price"
        value={servicePrice}
        onChangeText={setServicePrice}
      />
      <Button title="Add Service" onPress={handleAddService} />
    </View>
  );
};

export default Home;

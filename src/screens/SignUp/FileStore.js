import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCujg142JHu-h9i68_zS5b4Wt-466u1xmM",
  authDomain: "gizeye-20fa5.firebaseapp.com",
  projectId: "gizeye-20fa5",
  storageBucket: "gizeye-20fa5.appspot.com",
  messagingSenderId: "29032338202",
  appId: "1:29032338202:web:bc79107d3a2b8965ac12a3",
  measurementId: "G-CJRE4ZYMWV",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Fstore = () => {
  const [data, setData] = useState("");
  const [storedData, setStoredData] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "data", "example"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const retrievedData = docSnapshot.data().value;
          setStoredData(retrievedData);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const saveSalonData = async (salonData) => {
    try {
      const salonRef = doc(db, "salons", salonData.salonId);
      await setDoc(salonRef, salonData);
      console.log("Salon data saved successfully!");
    } catch (error) {
      console.error("Error saving salon data:", error);
    }
  };

  // Usage: Call the saveSalonData function with the salon data you want to save
  const salonData = {
    salonId: "salonId2",
    name: "Salon A",
    address: "123 Main St",
    phone: "123-456-7890",
    services: [
      {
        serviceId: "serviceId2",
        name: "Haircut",
        price: 30,
      },
    ],
  };

  saveSalonData(salonData);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Stored Data: {storedData}</Text>
      <TextInput
        placeholder="Enter data"
        onChangeText={(text) => setData(text)}
        value={data}
        style={{
          marginVertical: 10,
          paddingHorizontal: 10,
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
        }}
      />
      <Button title="Save Data" onPress={saveSalonData} />
    </View>
  );
};

export default Fstore;

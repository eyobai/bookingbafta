import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const Services = ({ route }) => {
  const [service, setService] = useState("");

  const handleAddService = async () => {
    const db = getFirestore();
    const { userId } = route.params;

    try {
      const docRef = await addDoc(collection(db, "services"), {
        userId,
        service,
      });

      console.log("Service added with ID: ", docRef.id);
      setService("");
    } catch (error) {
      console.error("Error adding service: ", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Service"
        value={service}
        onChangeText={setService}
      />
      <Button title="Add Service" onPress={handleAddService} />
    </View>
  );
};

export default Services;

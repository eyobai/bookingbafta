import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text } from "react-native";
import axios from "axios";

const ServiceForm = () => {
  const userId = "GrepHhQSTsgzdyiBYX49paY5W7z2";
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [services, setServices] = useState([]);

  const addService = () => {
    if (serviceName && servicePrice && serviceDuration) {
      setServices([
        ...services,
        {
          serviceName,
          servicePrice: parseFloat(servicePrice),
          serviceDuration: parseInt(serviceDuration),
        },
      ]);

      // Clear input fields after adding a service
      setServiceName("");
      setServicePrice("");
      setServiceDuration("");
    } else {
      // Display an error message or handle incomplete data
      console.error("Please fill in all fields before adding a service.");
    }
  };

  const addServicesToFirestore = async () => {
    try {
      // Check if services array is not empty
      if (services.length === 0) {
        console.error("No services to upload.");
        return;
      }

      const response = await axios.post(`http://192.168.0.3:3001/addServices`, {
        userId,
        services,
      });

      if (response.status === 201) {
        console.log("Services uploaded successfully");
        // Clear input fields and services array after successful upload

        setServices([]);
      } else {
        console.error("Failed to upload services:", response.data.error);
      }
    } catch (error) {
      console.error("Error uploading services:", error.message);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <TextInput
        placeholder="Service Name"
        value={serviceName}
        onChangeText={(text) => setServiceName(text)}
      />
      <TextInput
        placeholder="Service Price"
        value={servicePrice}
        onChangeText={(text) => setServicePrice(text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Service Duration"
        value={serviceDuration}
        onChangeText={(text) => setServiceDuration(text)}
        keyboardType="numeric"
      />
      <Button title="Add Service" onPress={addService} />
      <Button
        title="Add Services to Firestore"
        onPress={addServicesToFirestore}
      />

      <FlatList
        data={services}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.serviceName}</Text>
            <Text>Price: ${item.servicePrice}</Text>
            <Text>Duration: {item.serviceDuration} minutes</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ServiceForm;

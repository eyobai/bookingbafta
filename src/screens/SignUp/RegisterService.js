import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; // Updated import
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const ServiceForm = () => {
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("30"); // Default value
  const [services, setServices] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  const navigation = useNavigation();
  const addService = () => {
    if (serviceName && servicePrice && serviceDuration) {
      setServices([
        ...services,
        {
          name: serviceName,
          duration: serviceDuration,
          price: parseFloat(servicePrice),
        },
      ]);

      // Clear input fields after adding a service
      setServiceName("");
      setServicePrice("");
      setServiceDuration("30"); // Reset to default
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

      const response = await axios.post(`http://192.168.1.2:3001/addServices`, {
        userId,
        services,
      });

      if (response.status === 201) {
        console.log("Services uploaded successfully");
        // Clear input fields and services array after successful upload
        setServices([]);
        navigation.navigate("ImageUpload");
      } else {
        console.error("Failed to upload services:", response.data.error);
      }
    } catch (error) {
      console.error("Error uploading services:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={serviceName}
        onChangeText={(text) => setServiceName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Service Price"
        value={servicePrice}
        onChangeText={(text) => setServicePrice(text)}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Service Duration</Text>
        <Picker
          selectedValue={serviceDuration}
          onValueChange={(itemValue) => setServiceDuration(itemValue)}
          style={styles.picker}
          dropdownIconColor="#aaa"
        >
          <Picker.Item label="30 minutes" value="30" />
          <Picker.Item label="40 minutes" value="40" />
          <Picker.Item label="50 minutes" value="50" />
          {/* Add more options as needed */}
        </Picker>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addService}>
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logButton}
        onPress={addServicesToFirestore}
      >
        <Text style={styles.logButtonText}>Add Services to Firestore</Text>
      </TouchableOpacity>

      <FlatList
        data={services}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceDuration}>
              Duration: {item.duration} minutes
            </Text>
            <Text style={styles.servicePrice}>Price: ${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden", // Clip the dropdown options if they exceed the container's boundaries
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  logButton: {
    backgroundColor: "green",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  logButtonText: {
    color: "white",
    fontSize: 16,
  },
  serviceItem: {
    flexDirection: "column",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceDuration: {
    fontSize: 14,
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
  },
});

export default ServiceForm;

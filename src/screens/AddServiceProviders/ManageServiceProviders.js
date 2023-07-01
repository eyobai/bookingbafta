import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import ServiceProviderImageUpload from "./ServiceProviderImageUpload";

// Sample data of service providers
const initialServiceProviders = [
  {
    id: "1",
    name: "Stylist 1",
    phoneNumber: "1234567890",
    profilePicture: require("../../assets/bafta_logo.png"),
  },
  {
    id: "2",
    name: "Stylist 2",
    phoneNumber: "9876543210",
    profilePicture: require("../../assets/bafta_logo.png"),
  },
  {
    id: "3",
    name: "Stylist 3",
    phoneNumber: "5678901234",
    profilePicture: require("../../assets/bafta_logo.png"),
  },
];

function ManageServiceProviders() {
  const [serviceProviders, setServiceProviders] = useState(
    initialServiceProviders
  );
  const [newServiceProvider, setNewServiceProvider] = useState({
    name: "",
    phoneNumber: "",
    profilePicture: null,
  });

  const removeServiceProvider = (id) => {
    setServiceProviders((prevServiceProviders) =>
      prevServiceProviders.filter((provider) => provider.id !== id)
    );
  };

  const addServiceProvider = () => {
    if (newServiceProvider.name !== "") {
      const newProvider = {
        id: String(serviceProviders.length + 1),
        name: newServiceProvider.name,
        phoneNumber: newServiceProvider.phoneNumber,
        profilePicture: newServiceProvider.profilePicture,
      };
      setServiceProviders((prevServiceProviders) => [
        ...prevServiceProviders,
        newProvider,
      ]);
      setNewServiceProvider({
        name: "",
        phoneNumber: "",
        profilePicture: null,
      });
    }
  };

  const renderServiceProviderItem = ({ item }) => (
    <View style={styles.serviceProviderItem}>
      <Image source={item.profilePicture} style={styles.profilePicture} />
      <View style={styles.providerDetails}>
        <Text style={styles.serviceProviderName}>{item.name}</Text>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeServiceProvider(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Service Providers</Text>
      {/* Display ServiceProviderImageUpload component here */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={newServiceProvider.name}
          onChangeText={(text) =>
            setNewServiceProvider({ ...newServiceProvider, name: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={newServiceProvider.phoneNumber}
          onChangeText={(text) =>
            setNewServiceProvider({ ...newServiceProvider, phoneNumber: text })
          }
        />
      </View>
      <ServiceProviderImageUpload />
      <TouchableOpacity style={styles.addButton} onPress={addServiceProvider}>
        <Text style={styles.addButtonText}>Add Service Provider</Text>
      </TouchableOpacity>
      <FlatList
        data={serviceProviders}
        renderItem={renderServiceProviderItem}
        keyExtractor={(item) => item.id}
        style={styles.serviceProviderList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  serviceProviderList: {
    flex: 1,
  },
  serviceProviderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  providerDetails: {
    flex: 1,
  },
  serviceProviderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phoneNumber: {
    color: "#888",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ManageServiceProviders;

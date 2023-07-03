import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Image, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, deleteDoc,doc, collection, addDoc } from "firebase/firestore";
import { connect } from "react-redux";
import { firebaseConfig } from "../../firebase.config";
import { useSelector } from 'react-redux';
const db = getFirestore();

// Sample data of service providers

function ManageServiceProviders() {
  const userId = useSelector((state) => state.userId);

  const [serviceProviders, setServiceProviders] = useState(initialServiceProviders);
  const [newServiceProvider, setNewServiceProvider] = useState({
    name: "",
    phoneNumber: "",
    profilePicture: null,
  });

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const removeServiceProvider = (id) => {
    Alert.alert(
      "Remove Service Provider",
      "Are you sure you want to remove this service provider?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            // Remove the service provider from the state
            setServiceProviders((prevServiceProviders) =>
              prevServiceProviders.filter((provider) => provider.id !== id)
            );
        
            try {
              // Remove the service provider from the database
              const serviceProviderDocRef = doc(db, "serviceProviders", id);
              await deleteDoc(serviceProviderDocRef);
              console.log("Service provider removed from the database.");
            } catch (error) {
              console.log("Error removing service provider from the database:", error);
            }
          },
        },
      ]
    );
  };

  const addServiceProvider = async () => {
    if (newServiceProvider.name !== "") {
      const newProvider = {
        name: newServiceProvider.name,
        phoneNumber: newServiceProvider.phoneNumber,
        profilePicture: newServiceProvider.profilePicture,
      };
   
      try {
        // Create a new document in the serviceProviders collection
        const docRef = await addDoc(collection(db, "users"), newProvider,userId);
        console.log("Service provider added with ID: ", docRef.id);

        // Update the local state and reset the form
        setServiceProviders((prevServiceProviders) => [
          ...prevServiceProviders,
          { id: docRef.id, ...newProvider },
        ]);
        setNewServiceProvider({
          name: "",
          phoneNumber: "",
          profilePicture: null,
        });
      } catch (error) {
        console.error("Error adding service provider: ", error);
      }
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
      {/*      <ServiceProviderImageUpload />
*/}
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

import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase.config';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const ServiceForm = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const userId = useSelector((state) => state.userId);
  
  const navigation = useNavigation();

  const handleAddService = () => {
    const newService = {
      name: serviceName,
      duration: serviceDuration,
      price: servicePrice,
    };

    setServices([...services, newService]);
    setServiceName('');
    setServiceDuration('');
    setServicePrice('');
  };

  const handleRemoveService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleLogServices = async () => {
    try {
      // Loop through the services and store them in Firestore
      for (const service of services) {
        await addDoc(collection(db, 'services'), service,userId);
      }
      console.log('Services logged successfully!');
      navigation.navigate('ImageUpload');
    } catch (error) {
      console.error('Error logging services:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Service Name</Text>
        <TextInput
          style={styles.input}
          value={serviceName}
          onChangeText={setServiceName}
        />

<View style={styles.pickerContainer}>
          <Text style={styles.label}>Service Duration</Text>
          <Picker
            selectedValue={serviceDuration}
            onValueChange={(itemValue) => setServiceDuration(itemValue)}
            style={styles.picker}
            dropdownIconColor="#aaa" // Customize the color of the dropdown icon
            mode="dropdown" // Use "dropdown" mode for a more compact style
          >
            <Picker.Item label="30 minutes" value="30" />
            <Picker.Item label="60 minutes" value="60" />
            <Picker.Item label="90 minutes" value="90" />
          </Picker>
        </View>

        <Text style={styles.label}>Service Price</Text>
        <TextInput
          style={styles.input}
          value={servicePrice}
          onChangeText={setServicePrice}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>

      </View>

      <ScrollView style={styles.serviceList}>
        {services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDuration}>Duration: {service.duration} minutes</Text>
            <Text style={styles.servicePrice}>Price: ${service.price}</Text>
            <TouchableOpacity onPress={() => handleRemoveService(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={styles.logButton} onPress={handleLogServices}>
          <Text style={styles.logButtonText}>Next</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden', // Clip the dropdown options if they exceed the container's boundaries
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  logButton: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  logButtonText: {
    color: 'white',
    fontSize: 16,
  },
  serviceList: {
    flex: 1,
  },
  serviceItem: {
    flexDirection: 'column',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceDuration: {
    fontSize: 14,
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
  },
  removeButtonText: {
    color: 'red',
    marginTop: 5,
  },
});

export default ServiceForm;
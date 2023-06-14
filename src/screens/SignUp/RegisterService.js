import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const durationOptions = [
  { label: "30 min", value: "30" },
  { label: "1 hour", value: "60" },
  { label: "1:30 hour", value: "90" },
  { label: "2:00 hour", value: "120" },
  { label: "2:30 hour", value: "150" },
  { label: "3:00 hour", value: "180" },
];

const Services = ({ route }) => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    duration: "",
    priceCategory: "",
  });
  const removalAnimations = useRef([]);

  const handleAddService = async () => {
    const db = getFirestore();
    const { userId } = route.params;

    try {
      const serviceToAdd = { ...newService, userId };
      const docRef = await addDoc(collection(db, "services"), serviceToAdd);

      console.log("Service added with ID: ", docRef.id);

      setServices([...services, serviceToAdd]);
      console.log(services);
      setNewService({
        name: "",
        duration: "",
        priceCategory: "",
      });
    } catch (error) {
      console.error("Error adding service: ", error);
    }
  };

  const handleRemoveService = (index) => {
    const animatedValue = removalAnimations.current[index];

    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setServices((prevServices) => {
        const updatedServices = [...prevServices];
        updatedServices.splice(index, 1);
        return updatedServices;
      });
      removalAnimations.current.splice(index, 1);
    });
  };

  const handleAddAnotherService = () => {
    setServices((prevServices) => [...prevServices, { ...newService }]);
    setNewService({
      name: "",
      duration: "",
      priceCategory: "",
    });
  };

  const handleServiceChange = (value, field, index) => {
    setServices((prevServices) => {
      const updatedServices = [...prevServices];
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: value,
      };
      return updatedServices;
    });
  };

  const handleLayout = (index) => {
    if (!removalAnimations.current[index]) {
      removalAnimations.current[index] = new Animated.Value(1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>

      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView}>
          {services.map((service, index) => (
            <Animated.View
              key={index}
              style={[
                styles.fieldContainer,
                { opacity: removalAnimations.current[index] },
              ]}
              onLayout={() => handleLayout(index)}
            >
              <TextInput
                style={styles.input}
                placeholder="Service"
                value={service.name}
                onChangeText={(text) =>
                  handleServiceChange(text, "name", index)
                }
              />
              <View style={styles.durationContainer}>
                <Text style={styles.label}>Duration:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={service.duration}
                  onValueChange={(itemValue) =>
                    handleServiceChange(itemValue, "duration", index)
                  }
                >
                  {durationOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Price Category"
                value={service.priceCategory}
                onChangeText={(text) =>
                  handleServiceChange(text, "priceCategory", index)
                }
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveService(index)}
              >
                <MaterialIcons name="remove-circle" size={24} color="red" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAnotherService}
        >
          <Ionicons name="add" size={32} color="#069BA4" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleAddService}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  fieldContainer: {
    borderWidth: 1,
    borderColor: "#069BA4",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#069BA4",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 5,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Services;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase.config";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const SalonBookingApp = ({ selectedDate }) => {
  const [bookedServices, setBookedServices] = useState([]);

  useEffect(() => {
    const fetchBookedServices = async () => {
      const q = query(
        collection(db, "bookedServices"),
        where("date", "==", selectedDate)
      );
      const querySnapshot = await getDocs(q);
      const services = [];

      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() });
      });

      setBookedServices(services);
    };

    fetchBookedServices();
  }, [selectedDate]);

  const timeTable = [
    { id: 1, time: "9:00 AM" },
    { id: 2, time: "9:15 AM" },
    { id: 3, time: "9:30 AM" },
    { id: 4, time: "9:45 AM" },
    { id: 5, time: "10:00 AM" },
    { id: 6, time: "10:15 AM" },
    { id: 7, time: "10:30 AM" },
    { id: 8, time: "10:45 AM" },
    { id: 9, time: "11:00 AM" },
    { id: 19, time: "11:00 AM" },
    { id: 10, time: "12:00 AM" },
    { id: 11, time: "13:00 AM" },
    { id: 12, time: "13:00 AM" },
    { id: 13, time: "13:00 AM" },
    { id: 14, time: "13:00 AM" },
    { id: 15, time: "13:00 AM" },
    { id: 16, time: "13:15 AM" },
    { id: 17, time: "14:30 AM" },
    { id: 18, time: "15:30 AM" },
    { id: 29, time: "16:30 AM" },

    // Add more time slots as needed...
  ];

  const renderTimeSlot = ({ item }) => {
    const services = bookedServices.filter(
      (booking) => booking.date === selectedDate && booking.time === item.time
    );

    if (
      services.length > 0 ||
      item.time.endsWith(":00 AM") ||
      item.time.endsWith(":00 PM")
    ) {
      let backgroundColor = "#fff"; // Default background color

      if (services.length > 0) {
        // Set a background color for the booked services list
        backgroundColor = "#13BCBC";
      } else if (item.time.endsWith(":00 AM")) {
        // Set a different background color for time slots ending with ":00 AM"
        backgroundColor = "#f9f9f9";
      } else if (item.time.endsWith(":00 PM")) {
        // Set a different background color for time slots ending with ":00 PM"
        backgroundColor = "#fafafa";
      }

      return (
        <TouchableOpacity
          style={[styles.cardContainer, { backgroundColor }]} // Apply the background color dynamically
          onPress={() => handleTimeSlotPress(item.time)}
        >
          <Text style={styles.timeText}>{item.time}</Text>
          {services.length > 0 ? (
            services.map((service) => (
              <Text key={service.id} style={styles.serviceText}>
                {service.service}
              </Text>
            ))
          ) : (
            <Text>No services booked</Text>
          )}
        </TouchableOpacity>
      );
    } else {
      return null; // Hide the unbooked and non-full hour slots
    }
  };

  const handleTimeSlotPress = (time) => {
    // Handle logic for when a time slot is pressed
    console.log("Time slot pressed:", time);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booked Services</Text>
      <FlatList
        data={timeTable}
        renderItem={renderTimeSlot}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  serviceText: {
    fontSize: 14,
  },
});

export default SalonBookingApp;

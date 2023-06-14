import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../../firebase.config";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DayList = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, day: "Mon", time: "10:00 AM", available: true, booked: false },
    { id: 2, day: "Mon", time: "10:30 AM", available: true, booked: false },
    { id: 3, day: "Mon", time: "11:00 AM", available: true, booked: false },
    { id: 4, day: "Tue", time: "10:00 AM", available: true, booked: false },
    { id: 5, day: "Tue", time: "10:30 AM", available: true, booked: false },
    { id: 6, day: "Tue", time: "11:00 AM", available: true, booked: false },
    // Add more time slots for other days
    { id: 7, day: "Wed", time: "10:00 AM", available: true, booked: false },
    { id: 8, day: "Wed", time: "10:30 AM", available: true, booked: false },
    { id: 9, day: "Wed", time: "11:00 AM", available: true, booked: false },
    { id: 10, day: "Thu", time: "10:00 AM", available: true, booked: false },
    { id: 11, day: "Thu", time: "10:30 AM", available: true, booked: false },
    { id: 12, day: "Thu", time: "11:00 AM", available: true, booked: false },
    { id: 13, day: "Fri", time: "10:00 AM", available: true, booked: false },
    { id: 14, day: "Fri", time: "10:30 AM", available: true, booked: false },
    { id: 15, day: "Fri", time: "11:00 AM", available: true, booked: false },
    { id: 16, day: "Sat", time: "10:00 AM", available: true, booked: false },
    { id: 17, day: "Sat", time: "10:30 AM", available: true, booked: false },
    { id: 18, day: "Sat", time: "11:00 AM", available: true, booked: false },
    { id: 19, day: "Sun", time: "10:00 AM", available: true, booked: false },
    { id: 20, day: "Sun", time: "10:30 AM", available: true, booked: false },
    { id: 21, day: "Sun", time: "11:00 AM", available: true, booked: false },
  ]);

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
  };

  const handleSchedule = async () => {
    if (!selectedSlot || !selectedService) {
      Alert.alert("Error", "Please select a time slot and service.");
      return;
    }

    try {
      const bookingData = {
        day: selectedSlot.day,
        timeSlot: selectedSlot.time,
        service: selectedService,
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      console.log("Booking added with ID: ", docRef.id);

      setSelectedSlot(null);
      setSelectedService(null);

      Alert.alert("Success", "Booking confirmed!");

      // Reset selectedSlot and selectedService variables
      // You can also show a success message to the user
    } catch (error) {
      console.error("Error adding booking: ", error);
      // Handle the error and show an error message to the user
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Select a Day</Text>
      <View style={styles.dayList}>
        <TouchableOpacity
          style={[
            styles.dayButton,
            selectedDay === "Mon" && styles.selectedDayButton,
          ]}
          onPress={() => setSelectedDay("Mon")}
        >
          <Text style={styles.dayText}>Mon</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.dayButton,
            selectedDay === "Tue" && styles.selectedDayButton,
          ]}
          onPress={() => setSelectedDay("Tue")}
        >
          <Text style={styles.dayText}>Tue</Text>
        </TouchableOpacity>
        {/* Add more day buttons */}
      </View>

      {selectedDay && (
        <View>
          <Text style={styles.heading}>Select a Time Slot</Text>
          <FlatList
            data={timeSlots.filter((slot) => slot.day === selectedDay)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.slotButton,
                  selectedSlot === item && styles.selectedSlotButton,
                ]}
                onPress={() => handleSlotSelection(item)}
                disabled={!item.available || item.booked}
              >
                <Text style={styles.slotText}>{item.time}</Text>
                {item.booked && <Text style={styles.bookedText}>Booked</Text>}
              </TouchableOpacity>
            )}
            numColumns={3}
          />
        </View>
      )}

      {selectedSlot && (
        <View>
          <Text style={styles.heading}>Select a Service</Text>
          <View style={styles.serviceList}>
            <TouchableOpacity
              style={[
                styles.serviceButton,
                selectedService === "Haircut" && styles.selectedServiceButton,
              ]}
              onPress={() => handleServiceSelection("Haircut")}
            >
              <Text style={styles.serviceText}>Haircut</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.serviceButton,
                selectedService === "Coloring" && styles.selectedServiceButton,
              ]}
              onPress={() => handleServiceSelection("Coloring")}
            >
              <Text style={styles.serviceText}>Coloring</Text>
            </TouchableOpacity>
            {/* Add more service buttons */}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
        <Text style={styles.scheduleButtonText}>Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dayList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  selectedDayButton: {
    backgroundColor: "#000",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
  },
  slotButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
  },
  selectedSlotButton: {
    backgroundColor: "#000",
  },
  slotText: {
    fontSize: 16,
    color: "#000",
  },
  bookedText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
  serviceList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  serviceButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
  },
  selectedServiceButton: {
    backgroundColor: "#000",
  },
  serviceText: {
    fontSize: 16,
    color: "#000",
  },
  scheduleButton: {
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  scheduleButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default DayList;

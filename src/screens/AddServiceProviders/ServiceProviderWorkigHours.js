import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "../../firebase.config";
import { useNavigation } from "@react-navigation/native";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ServiceProviderWorkingHours = () => {
  const [workingHours, setWorkingHours] = useState({
    Monday: { start: "", end: "", isEnabled: true },
    Tuesday: { start: "", end: "", isEnabled: true },
    Wednesday: { start: "", end: "", isEnabled: true },
    Thursday: { start: "", end: "", isEnabled: true },
    Friday: { start: "", end: "", isEnabled: true },
    Saturday: { start: "", end: "", isEnabled: true },
    Sunday: { start: "", end: "", isEnabled: true },
  });

  const [selectedDay, setSelectedDay] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const [isSettingStartTime, setIsSettingStartTime] = useState(true);
  const [isAllSet, setIsAllSet] = useState(false);
  const navigation = useNavigation();

  const userId = useSelector((state) => state.userId);

  useEffect(() => {
    // Check if all start and end times are set
    const allSet = Object.values(workingHours).every(
      (day) => day.isEnabled && day.start !== "" && day.end !== ""
    );
    setIsAllSet(allSet);
  }, [workingHours]);

  const handleSelectHours = (day, settingStartTime) => {
    setSelectedDay(day);
    setIsSettingStartTime(settingStartTime);
    setPickerModal(true);
  };

  const handleToggleClosed = (day) => {
    const updatedWorkingHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        isEnabled: !workingHours[day].isEnabled,
      },
    };

    setWorkingHours(updatedWorkingHours);
  };

  const handlePickerConfirm = (selectedTime) => {
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const updatedWorkingHours = {
        ...workingHours,
        [selectedDay]: {
          ...workingHours[selectedDay],
          start: isSettingStartTime
            ? workingHours[selectedDay].isEnabled
              ? timeString
              : ""
            : workingHours[selectedDay].start,
          end: isSettingStartTime
            ? workingHours[selectedDay].end
            : workingHours[selectedDay].isEnabled
            ? timeString
            : "",
        },
      };

      setWorkingHours(updatedWorkingHours);
    }

    setPickerModal(false);
  };

  const handleNext = async () => {
    try {
      // Generate a unique ID for the service provider
      const providerId = generateUniqueId();

      // Save the working hours and on/off status in Firestore with the provider ID
      await setDoc(doc(db, "workingHours", providerId), {
        userId,
        workingHours,
      });

      // Perform any additional actions or navigation after storing the data
      console.log("Working hours stored in Firestore");
      navigation.navigate("ImageUpload");
    } catch (error) {
      // Handle the error
      console.log("Error storing working hours:", error);
    }
  };

  const generateUniqueId = () => {
    // Generate a unique ID for the service provider using a suitable algorithm
    // You can use libraries like `uuid` or generate a custom ID based on requirements
    // Here's a simple example using the current timestamp:
    return new Date().getTime().toString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Working Hours</Text>
      {Object.entries(workingHours).map(([day, data]) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayText}>{day}</Text>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switch,
                data.isEnabled ? styles.switchOn : styles.switchOff,
              ]}
              onPress={() => handleToggleClosed(day)}
            >
              <Text style={styles.switchText}>
                {data.isEnabled ? "On" : "Off"}
              </Text>
            </TouchableOpacity>
          </View>
          {data.isEnabled && (
            <View style={styles.timeContainer}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  data.start === "" && data.end === ""
                    ? styles.timeButtonInactive
                    : null,
                ]}
                onPress={() => handleSelectHours(day, true)}
              >
                <Text style={styles.timeButtonText}>
                  {data.start || "Start"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>-</Text>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  data.start === "" && data.end === ""
                    ? styles.timeButtonInactive
                    : null,
                ]}
                onPress={() => handleSelectHours(day, false)}
              >
                <Text style={styles.timeButtonText}>{data.end || "End"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={pickerModal}
        mode="time"
        onConfirm={handlePickerConfirm}
        onCancel={() => setPickerModal(false)}
        pickerMode="spinner"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 20, // Added vertical padding
    paddingHorizontal: 20, // Added horizontal padding
    borderWidth: 1, // Added border width
    borderColor: "#ccc", // Added border color
    borderRadius: 8, // Added border radius
  },
  dayText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  switchContainer: {
    marginRight: 10,
  },
  switch: {
    width: 50,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
  },
  switchOn: {
    backgroundColor: "#4CAF50",
  },
  switchOff: {
    backgroundColor: "#FF5722",
  },
  switchText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  timeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#2196F3",
    marginRight: 10,
  },
  timeButtonInactive: {
    backgroundColor: "#9E9E9E",
  },
  timeButtonText: {
    color: "white",
  },
  timeSeparator: {
    marginHorizontal: 5,
  },
  nextBtn: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceProviderWorkingHours;

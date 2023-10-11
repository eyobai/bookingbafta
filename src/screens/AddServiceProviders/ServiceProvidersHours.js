import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";

const ServiceProviderHours = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const [isSettingStartTime, setIsSettingStartTime] = useState(true);
  const [isAllSet, setIsAllSet] = useState(false);

  const userId = useSelector((state) => state.user.userId);
  //const userId = "fVmkmEVXOITvHukz6x9zdHQzNDm1";
  const serviceProviderId = useSelector((state) => state.employee.employeeId);
  //const serviceProviderId = "CHa9RjR6ZhOLsWs1650t1fDtKYw1";
  console.log(
    "User ID from Redux:",
    useSelector((state) => state.user.userId)
  );
  console.log(
    "Service Provider ID from Redux:",
    useSelector((state) => state.employee)
  );

  const [workingHours, setWorkingHours] = useState({
    Monday: { isEnabled: true, start: "02:00 AM", end: "02:00 PM" },
    Tuesday: { isEnabled: true, start: "02:00 AM", end: "02:00 PM" },
    Wednesday: { isEnabled: true, start: "02:00 AM", end: "02:00 PM" },
    Thursday: { isEnabled: true, start: "02:00 AM", end: "02:00 PM" },
    Friday: { isEnabled: true, start: "02:00 AM", end: "02:00 PM" },
    Saturday: { isEnabled: true, start: "02:00 AM", end: "02:00 PM" },
    Sunday: { isEnabled: true, start: "02:00 AM", end: "02:00 PM" },
  });

  const navigation = useNavigation();

  useEffect(() => {
    const allSet = Object.values(workingHours).every(
      (day) => day.isEnabled || (day.start !== "" && day.end !== "")
    );
    setIsAllSet(allSet);
  }, [workingHours]);

  const handleNext = async () => {
    try {
      const allSet = Object.values(workingHours).every(
        (day) =>
          !day.isEnabled ||
          (day.isEnabled && day.start !== "" && day.end !== "")
      );

      if (allSet) {
        const requestData = {
          userId, // Assuming you have userId in your component's state
          serviceProviderId, // Assuming you have serviceProviderId in your component's state
          workingHours, // The working hours data from your state
        };

        // Send a POST request to your server route
        const response = await axios.post(
          "https://server.bafta.co/setWorkingHours",
          requestData
        );

        // Handle the response from the server
        console.log(response.data); // This will contain the response data from your server

        // After successfully sending the data, navigate to the next screen
        navigation.navigate("serviceProvidersImageUpload");
      } else {
        // Handle the case where not all required selections are made
      }
    } catch (error) {
      console.log("Error storing working hours:", error);
      // Handle the error appropriately
    }
  };

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
        isEnabled: !workingHours[day].isEnabled, // Toggle isEnabled
        start: workingHours[day].isEnabled ? "02:00 AM" : "", // Set default start time when enabling
        end: workingHours[day].isEnabled ? "02:00 PM" : "", // Set default end time when enabling
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
  console.log("userId:", userId);
  console.log("serviceProviderId:", serviceProviderId);
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
                {data.isEnabled ? "On" : "Closed"}
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
      <TouchableOpacity
        style={styles.nextBtn}
        onPress={handleNext}
        disabled={!isAllSet}
      >
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
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

export default ServiceProviderHours;

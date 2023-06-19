import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase.config';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const WorkingHoursPage = () => {
  const [workingHours, setWorkingHours] = useState({
    Monday: { start: '02:00 AM', end: '02:00 PM', isClosed: false },
    Tuesday: { start: '02:00 AM', end: '02:00 PM', isClosed: false },
    Wednesday: { start: '02:00 AM', end: '02:00 PM', isClosed: false },
    Thursday: { start: '02:00 AM', end: '02:00 PM', isClosed: false },
    Friday: { start: '02:00 AM', end: '02:00 PM', isClosed: false },
    Saturday: { start: '02:00 AM', end: '02:00 PM', isClosed: false },
    Sunday: { start: '02:00 AM', end: '02:00 PM', isClosed: false },
  });

  const [selectedDay, setSelectedDay] = useState('');
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [isSettingStartTime, setIsSettingStartTime] = useState(true);
  const [isAllSet, setIsAllSet] = useState(false);

  useEffect(() => {
    // Check if all start and end times are set
    const allSet = Object.values(workingHours).every(
      (day) => day.start !== '' && day.end !== ''
    );
    setIsAllSet(allSet);
  }, [workingHours]);

  const handleSelectHours = (day, settingStartTime) => {
    if (!workingHours[day].isClosed) {
      setSelectedDay(day);
      setIsSettingStartTime(settingStartTime);
      setShowPickerModal(true);
    }
  };

  const handleToggleClosed = (day) => {
    const updatedWorkingHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        isClosed: !workingHours[day].isClosed,
        start: workingHours[day].isClosed ? '02:00 AM' : '',
        end: workingHours[day].isClosed ? '02:00 PM' : '',
      },
    };

    setWorkingHours(updatedWorkingHours);
  };

  const handleStartPickerConfirm = (selectedTime) => {
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedWorkingHours = {
        ...workingHours,
        [selectedDay]: {
          ...workingHours[selectedDay],
          start: workingHours[selectedDay].isClosed ? 'Closed' : timeString,
        },
      };

      // Validate end time
      const endTime = workingHours[selectedDay].end;
      if (
        endTime &&
        new Date(`1970-01-01T${timeString}`) > new Date(`1970-01-01T${endTime}`)
      ) {
        // Display error message or handle the invalid selection as per your requirement
        console.log('Invalid time selection');
        return;
      }

      setWorkingHours(updatedWorkingHours);
    }

    setShowPickerModal(false);
  };

  const handleEndPickerConfirm = (selectedTime) => {
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedWorkingHours = {
        ...workingHours,
        [selectedDay]: {
          ...workingHours[selectedDay],
          end: workingHours[selectedDay].isClosed ? 'Closed' : timeString,
        },
      };

      // Validate start time
      const startTime = workingHours[selectedDay].start;
      if (
        startTime &&
        new Date(`1970-01-01T${timeString}`) < new Date(`1970-01-01T${startTime}`)
      ) {
        // Display error message or handle the invalid selection as per your requirement
        console.log('Invalid time selection');
        return;
      }

      setWorkingHours(updatedWorkingHours);
    }

    setShowPickerModal(false);
  };

  const handleNext = async () => {
    if (!isAllSet) {
      // Display error message or handle the incomplete selection as per your requirement
      console.log('All start and end times must be set');
      return;
    }

    try {
      // Generate a unique ID for the service provider
      const providerId = generateUniqueId();

      // Save the working hours in Firestore with the provider ID
      await addDoc(collection(db, 'workingHours'), {
        providerId,
        workingHours,
      });

      // Perform any additional actions or navigation after storing the data
      console.log('Working hours stored in Firestore');
    } catch (error) {
      // Handle the error
      console.log('Error storing working hours:', error);
    }
  };

  const generateUniqueId = () => {
    // Generate a unique ID for the service provider using a suitable algorithm
    // You can use libraries like `uuid` or generate a custom ID based on your requirements
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Working Hours</Text>
      {Object.keys(workingHours).map((day) => (
        <TouchableOpacity
          key={day}
          style={styles.dayContainer}
          onPress={() => handleSelectHours(day, true)}
        >
          <View style={styles.dayAndTimeContainer}>
            <Text style={styles.day}>{day}</Text>
            <View style={styles.timeContainer}>
              <TouchableOpacity onPress={() => handleSelectHours(day, true)}>
                <Text style={styles.time}>
                  {workingHours[day].isClosed ? 'Closed' : workingHours[day].start || 'Start'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timeSeparator}> - </Text>
              <TouchableOpacity onPress={() => handleSelectHours(day, false)}>
                <Text style={styles.time}>
                  {workingHours[day].isClosed ? 'Closed' : workingHours[day].end || 'End'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      {isAllSet && <Text>All start and end times are set.</Text>}
      {showPickerModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>
              Setting {isSettingStartTime ? 'Start' : 'End'} Time for {selectedDay}
            </Text>
            <DateTimePickerModal
              isVisible={true}
              mode="time"
              onConfirm={isSettingStartTime ? handleStartPickerConfirm : handleEndPickerConfirm}
              onCancel={() => setShowPickerModal(false)}
              pickerType="clock"
            />
          </View>
        </View>
      )}
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dayContainer: {
    borderWidth: 1,
    borderColor: '#069BA4',
    borderRadius: 8,
    marginBottom: 10,
    padding: 20,
  },
  dayAndTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  day: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#069BA4',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 18,
    color: '#333',
  },
  timeSeparator: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#069BA4',
  },
});

export default WorkingHoursPage;

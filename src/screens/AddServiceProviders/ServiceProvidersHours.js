import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector, useDispatch } from 'react-redux';
import { setWorkingHours } from '../../redux/workingHourStore';
import { useNavigation } from "@react-navigation/native";

const  ServiceProviderHours = () => {

  const [selectedDay, setSelectedDay] = useState('');
  const [pickerModal, setPickerModal] = useState(false);
  const [isSettingStartTime, setIsSettingStartTime] = useState(true);
  const [isAllSet, setIsAllSet] = useState(false);
  const navigation = useNavigation();

  const workingHours = useSelector((state) => state. workingHour.workingHours);
  const dispatch = useDispatch();

  useEffect(() => {
    const allSet = Object.values(workingHours).every(
      (day) => day.isEnabled && day.start !== '' && day.end !== ''
    );
    setIsAllSet(allSet);
  }, [workingHours]);

  const handleNext = () => {
    try {
      const allSet = Object.values(workingHours).every(
        (day) => !day.isEnabled || (day.isEnabled && day.start !== '' && day.end !== '')
      );
    
      if (allSet) {
        dispatch(setWorkingHours(workingHours));
        navigation.navigate("serviceProvidersImageUpload");
      } else {
        // Handle the case where not all required selections are made
      }
    } catch (error) {
      console.log('Error storing working hours:', error);
    }
  };
  
  useEffect(() => {
    const allSet = Object.values(workingHours).every(
      (day) => !day.isEnabled || (day.isEnabled && day.start !== '' && day.end !== '')
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
    dispatch(setWorkingHours(updatedWorkingHours));
  };
  

  const handlePickerConfirm = (selectedTime) => {
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
  
      const updatedWorkingHours = {
        ...workingHours,
        [selectedDay]: {
          ...workingHours[selectedDay],
          start: isSettingStartTime
            ? workingHours[selectedDay].isEnabled
              ? timeString
              : ''
            : workingHours[selectedDay].start,
          end: isSettingStartTime
            ? workingHours[selectedDay].end
            : workingHours[selectedDay].isEnabled
              ? timeString
              : '',
        },
      };
  
      dispatch(setWorkingHours(updatedWorkingHours));
    }
  
    setPickerModal(false);
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Working Hours</Text>
      {Object.entries(workingHours).map(([day, data]) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayText}>{day}</Text>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[styles.switch, data.isEnabled ? styles.switchOn : styles.switchOff]}
              onPress={() => handleToggleClosed(day)}
            >
              <Text style={styles.switchText}>{data.isEnabled ? 'On' : 'Closed'}</Text>
            </TouchableOpacity>
          </View>
          {data.isEnabled && (
            <View style={styles.timeContainer}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  data.start === '' && data.end === '' ? styles.timeButtonInactive : null,
                ]}
                onPress={() => handleSelectHours(day, true)}
              >
                <Text style={styles.timeButtonText}>{data.start || 'Start'}</Text>
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>-</Text>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  data.start === '' && data.end === '' ? styles.timeButtonInactive : null,
                ]}
                onPress={() => handleSelectHours(day, false)}
              >
                <Text style={styles.timeButtonText}>{data.end || 'End'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={!isAllSet}>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dayText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    marginRight: 10,
  },
  switch: {
    width: 50,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchOn: {
    backgroundColor: '#4CAF50',
  },
  switchOff: {
    backgroundColor: '#FF5722',
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  timeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    marginRight: 10,
  },
  timeButtonInactive: {
    backgroundColor: '#9E9E9E',
  },
  timeButtonText: {
    color: 'white',
  },
  timeSeparator: {
    marginHorizontal: 5,
  },
  nextBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceProviderHours;

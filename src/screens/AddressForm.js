import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const DisplayUsers = () => {
  const workingHours = useSelector((state) => state.workingHour.workingHours);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Working Hours</Text>
      {Object.entries(workingHours).map(([day, data]) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayText}>{day}</Text>
          {data.isEnabled ? (
            <Text style={styles.timeText}>
              {data.start} - {data.end}
            </Text>
          ) : (
            <Text style={styles.timeText}>Closed</Text>
          )}
        </View>
      ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
});

export default DisplayUsers;

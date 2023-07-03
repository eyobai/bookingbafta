import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Congratulations = () => {
  const navigation = useNavigation();

  const handleLoginButtonPress = () => {
    navigation.navigate('Login'); // Replace 'Login' with the actual name of your login screen
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="check-circle" size={80} color="white" style={styles.icon} />
      <Text style={styles.congratulationsText}>Congratulations! You're all set.</Text>
      <Text style={styles.subtitleText}>
        We're excited to help you run your business. Invite your existing customers to schedule their next appointment using bafta.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginButtonPress}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC107', // Customize the background color
    paddingHorizontal: 20,
    paddingBottom: 40, // Add padding to accommodate the button at the bottom
  },
  icon: {
    marginBottom: 20,
  },
  congratulationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white', // Customize the text color
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white', // Customize the text color
    marginTop: 10,
  },
  button: {
    backgroundColor: '#191919', // Customize the button background color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Customize the button text color
  },
});

export default Congratulations;

import React, { useState } from 'react';
import { Button, View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, putString, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase.config';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: 'dotted',
    borderRadius: 0,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 0,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);

  const handleImageSelection = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setSelectedImage(uri);
        setImageSelected(true);
      } else {
        console.log('Image selection cancelled.');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setSelectedImage(uri);
        setImageSelected(true);
      } else {
        console.log('Image capture cancelled.');
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleUploadButtonPress = async () => {
    if (selectedImage) {
      try {
        const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const storageRef = ref(storage, `images/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on('state_changed', (snapshot) => {
          const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercentage);
        });

        setUploading(true);

        await uploadTask;

        const downloadURL = await getDownloadURL(storageRef);

        console.log('Image uploaded successfully:', downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
        setProgress(0);
        setImageSelected(false);
        setSelectedImage(null);
      }
    } else {
      console.log('No image selected.');
    }
  };

  return (
<View style={styles.flexContainer}>
      <Button title="Select from Library" onPress={handleImageSelection} />
      <Button title="Take a Photo" onPress={handleCameraCapture} />
      {imageSelected && selectedImage ? (
        <View style={styles.container}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>Add workplace photo</Text>
        </View>
      )}
      {uploading && (
        <View>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text>Uploading: {progress.toFixed(2)}%</Text>
        </View>
      )}
    </View>
  );
}

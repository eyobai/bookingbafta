import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase.config';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const desiredImageWidth = 100;
const desiredImageHeight = 100;

const ServiceSetup = () => {
  const [imageURIs, setImageURIs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setIsLoading(false);

      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera roll permissions to upload images.');
      }
    })();
  }, []);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [desiredImageWidth, desiredImageHeight],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageURIs((prevImageURIs) => [...prevImageURIs, result.uri]);
    }
  };

  const uploadImage = async () => {
    console.log('userId:', userId);
    if (imageURIs.length === 0) {
      Alert.alert('No images selected', 'Please select at least one image to upload.');
      return;
    }

    const imagePromises = imageURIs.map(async (imageURI) => {
      try {
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const storageRef = ref(storage, 'portfolio/' + Date.now() + '.jpg');
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(progress);
            },
            (error) => {
              console.log('Error uploading image:', error);
              reject('Failed to upload image. Please try again.');
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  // Store the image reference in Firestore
                  const imageReference = {
                    url: downloadURL,
                    userId: userId,
                    createdAt: new Date().toISOString(),
                  };

                  addDoc(collection(db, 'portfolio'), imageReference)
                    .then(() => {
                      console.log('Image reference stored in Firestore');
                      resolve();
                    })
                    .catch((error) => {
                      console.log('Error storing image reference:', error);
                      reject('Failed to store image reference. Please try again.');
                    });
                })
                .catch((error) => {
                  console.log('Error getting download URL:', error);
                  reject('Failed to get download URL. Please try again.');
                })
                .finally(() => {
                  setUploadProgress(0);
                });
            }
          );
        });
      } catch (error) {
        console.log('Error fetching image:', error);
        throw new Error('Failed to fetch image. Please try again.');
      }
    });

    try {
      await Promise.all(imagePromises);
      Alert.alert('Upload successful', 'Images uploaded successfully!');
      navigation.navigate('Congratulations');
    } catch (error) {
      Alert.alert('Upload failed', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageURIs.map((uri, index) => (
          <View key={index} style={styles.imageBox}>
            <Image source={{ uri: uri }} style={styles.image} resizeMode="cover" />
          </View>
        ))}
        {imageURIs.length === 0 && (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}
      </View>
      <Button title="Select Image" onPress={selectImage} />
      <Button title="Upload Images" onPress={uploadImage} disabled={imageURIs.length === 0} />

      {uploadProgress > 0 && <Text style={styles.progressText}>{`Uploading: ${uploadProgress}%`}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageBox: {
    width: desiredImageWidth,
    height: desiredImageHeight,
    margin: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  progressText: {
    marginTop: 10,
  },
});

export default ServiceSetup;

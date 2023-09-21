import React, { useEffect, useState } from 'react';
import { Button, View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, putString, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getFirestore, doc, updateDoc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';


import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase.config';
import { useSelector } from 'react-redux';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const desiredImageWidth = 340;
const desiredImageHeight = 200;

export default function App() {
  const [imageURI, setImageURI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigation = useNavigation();
  
  const adminId = useSelector((state) => state.user.userId);
  const employeeId = useSelector((state) => state.employee);
  const workingHours = useSelector((state) => state.workingHour.workingHours);
  const servicveProviderData = useSelector((state) => state.serviceProvider.userData);
  
  const serviceProviderInformation= async () => {
    try {

      const usersCollectionRef = await addDoc(collection(db,"serviceprovidersusers"),{
        servicveProviderData,
      adminId:adminId,
       employeeId:employeeId
      })
 
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

 const serviceProviderWorkingHours=async()=>{
  try{
    const usersCollectionRef = await addDoc(collection(db,"serviceProviderWorkingHours"),{
      workingHours,
      adminId:adminId,
      employeeId:employeeId
    })
  }catch(error){
    console.error('error storing workingHours',error);
  }
 };

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
    setImageURI(result.uri);
  }
};

// ... Existing code ...

const uploadImage = async () => {
  console.log('userId:', employeeId);
  if (!imageURI) {
    Alert.alert('No image selected', 'Please select an image to upload.');
    return;
  }

  const response = await fetch(imageURI);
  const blob = await response.blob();

  const storageRef = ref(storage, 'newimages/' + Date.now() + '.jpg');
  const uploadTask = uploadBytesResumable(storageRef, blob);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setUploadProgress(progress);
    },
    (error) => {
      console.log('Error uploading image:', error);
      Alert.alert('Upload failed', 'Failed to upload image. Please try again.');
    },
    async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Store the image reference in Firestore
        const imageReference = {
          url: downloadURL,
          adminId:adminId,
          employeeId: employeeId
        
        };

        await addDoc(collection(db, 'employeeProfile'), imageReference);

        // Call the service provider information
        await serviceProviderInformation();

        // Call the serviceProviderWorkingHours
        await serviceProviderWorkingHours();
        console.log(adminId);
        navigation.navigate('Congratulations');
      } catch (error) {
        console.log('Error storing image reference:', error);
      }
    }
  );
};

// ... Existing code ...

if (isLoading) {
  return <View style={styles.container}><Text>Loading...</Text></View>;
}


  

return (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <View style={styles.dottedBox} />

      {imageURI && (
        <>
          <Image source={{ uri: imageURI }} style={styles.image} resizeMode="contain" />
        </>
      )}
    </View>
    <Button title="Select Image" onPress={selectImage} />
    <Button title="Upload Image" onPress={uploadImage} disabled={!imageURI} />

    {uploadProgress > 0 && (
      <Text style={styles.progressText}>{`Uploading: ${uploadProgress}%`}</Text>
    )}
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: desiredImageWidth,
    height: desiredImageHeight,
  },
  image: {
    width: desiredImageWidth,
    height: desiredImageHeight,
  },
  dottedBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: desiredImageWidth,
    height: desiredImageHeight,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'black',
    borderRadius: 5,
  },
  progressText: {
    marginTop: 10,
  },
});
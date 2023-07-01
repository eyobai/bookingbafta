import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  putString,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase.config";
import { useSelector } from "react-redux";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "dotted",
    borderRadius: 8,
    borderStyle: "dashed",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    textDecorationLine: "underline",
  },
  flexContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginBottom: 16,
  },
  uploadButton: {
    marginBottom: 16,
  },
});

export default function ServiceProviderImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const userId = useSelector((state) => state.userId);
  const navigation = useNavigation();
  const [showButtons, setShowButtons] = useState(false);

  const handleImageSelection = async () => {
    try {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        console.log("Permission denied");
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
        setIsImageSelected(true);
      } else {
        console.log("Image selection cancelled.");
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        console.log("Permission denied");
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
        setIsImageSelected(true);
      } else {
        console.log("Image capture cancelled.");
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const handleUploadButtonPress = async () => {
    if (selectedImage) {
      try {
        const filename = selectedImage.substring(
          selectedImage.lastIndexOf("/") + 1
        );
        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const storageRef = ref(storage, `images/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on("state_changed", (snapshot) => {
          const progressPercentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercentage);
        });

        setUploading(true);

        await uploadTask;

        const downloadURL = await getDownloadURL(storageRef);

        console.log("Image uploaded successfully:", downloadURL);
        console.log("image type is", typeof userId);
        console.log(userId.userIdProperty);
        const userIdString = JSON.stringify(userId);
        const userIdObject = JSON.parse(userIdString);
        const userIdReference = userIdObject.userId;
        console.log(userIdReference);
        // Save the image reference to Firestore
        const profileRef = doc(db, "profile", userIdReference);
        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          await updateDoc(profileRef, {
            image: downloadURL,
          });
        } else {
          await setDoc(profileRef, {
            image: downloadURL,
          });
        }

        console.log("Image reference saved to Firestore.");
        navigation.navigate("Congratulations");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
        setProgress(0);
        setIsImageSelected(false);
        setSelectedImage(null);
      }
    } else {
      console.log("No image selected.");
    }
  };

  const handleTextPress = () => {
    setShowButtons(true);
  };

  return (
    <View style={styles.flexContainer}>
      <View>
        <TouchableWithoutFeedback onPress={handleTextPress}>
          <View style={styles.container}>
            {isImageSelected && selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              <Text style={styles.text}>Add workplace photo</Text>
            )}
          </View>
        </TouchableWithoutFeedback>

        {showButtons && (
          <View>
            <View style={styles.buttonContainer}>
              <Button
                title="Select from Library"
                onPress={handleImageSelection}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Take a Photo" onPress={handleCameraCapture} />
            </View>
          </View>
        )}

        {uploading && (
          <View>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}

        {isImageSelected && (
          <View style={styles.uploadButton}>
            <Button
              title={
                uploading ? `Uploading: ${progress.toFixed(2)}%` : "Upload"
              }
              onPress={handleUploadButtonPress}
              disabled={uploading}
            />
          </View>
        )}
      </View>
    </View>
  );
}

import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase.config";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const desiredImageWidth = 340;
const desiredImageHeight = 200;

const ImageUpload = () => {
  const [imageURI, setImageURI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setIsLoading(false);

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant camera roll permissions to upload images."
        );
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

    if (!result.canceled) {
      setImageURI(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    console.log("userId:", userId);
    if (!imageURI) {
      Alert.alert("No image selected", "Please select an image to upload.");
      return;
    }

    const response = await fetch(imageURI);
    const blob = await response.blob();

    const storageRef = ref(storage, "newimages/" + Date.now() + ".jpg");
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.log("Error uploading image:", error);
        Alert.alert(
          "Upload failed",
          "Failed to upload image. Please try again."
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURI(null);

          // Update the user document with the image URL
          const userDocRef = doc(db, "users", userId); // Assuming 'users' is the collection name
          updateDoc(userDocRef, {
            businessPicture: downloadURL,
          })
            .then(() => {
              console.log("Image URL stored in the user document");
              navigation.navigate("Congratulations");
            })
            .catch((error) => {
              console.log(
                "Error updating user document with image URL:",
                error
              );
            });
        });
      }
    );
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
        <View style={styles.dottedBox} />

        {imageURI && (
          <>
            <Image
              source={{ uri: imageURI }}
              style={styles.image}
              resizeMode="contain"
            />
          </>
        )}
      </View>
      <Button title="Select Image" onPress={selectImage} />
      <Button title="Upload Image" onPress={uploadImage} disabled={!imageURI} />

      {uploadProgress > 0 && (
        <Text
          style={styles.progressText}
        >{`Uploading: ${uploadProgress}%`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    position: "relative",
    width: desiredImageWidth,
    height: desiredImageHeight,
  },
  image: {
    width: desiredImageWidth,
    height: desiredImageHeight,
  },
  dottedBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: desiredImageWidth,
    height: desiredImageHeight,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "black",
    borderRadius: 5,
  },
  progressText: {
    marginTop: 10,
  },
});

export default ImageUpload;

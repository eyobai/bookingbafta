import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

const desiredImageWidth = 340;
const desiredImageHeight = 200;

const ImageUpload = () => {
  const [imageURI, setImageURI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const userId = useSelector((state) => state.user.userId);
  //const userId = "fVmkmEVXOITvHukz6x9zdHQzNDm1";
  const serviceProviderId = useSelector((state) => state.employee.employeeId);
  //const serviceProviderId = "CHa9RjR6ZhOLsWs1650t1fDtKYw1";
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
    if (!imageURI) {
      Alert.alert("No image selected", "Please select an image to upload.");
      return;
    }

    const data = new FormData();
    data.append("userId", userId);
    data.append("serviceProviderId", serviceProviderId);

    // Log the userId and serviceProviderId for debugging
    console.log("userId:", userId);
    console.log("serviceProviderId:", serviceProviderId);

    data.append("image", {
      name: "image.jpg",
      type: "image/jpeg",
      uri: imageURI,
    });

    try {
      const response = await fetch("https://server.bafta.co/uploadImage", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        // Image uploaded successfully
        Alert.alert("Success", "Image uploaded successfully.");
        setImageURI(null); // Clear the selected image
      } else {
        // Handle the case where the server returns an error
        const responseData = await response.json();
        Alert.alert("Error", responseData.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
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

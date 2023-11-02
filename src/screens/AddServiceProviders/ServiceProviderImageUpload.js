import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ProgressBarAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import COLORS from "../../consts/colors";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";

const desiredImageWidth = 340;
const desiredImageHeight = 200;

const ImageUpload = () => {
  const [imageURI, setImageURI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const userId = useSelector((state) => state.user.userId);
  const serviceProviderId = useSelector((state) => state.employee.employeeId);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
    data.append("image", {
      name: "image.jpg",
      type: "image/jpeg",
      uri: imageURI,
    });
    // Simulate the progress
    setUploadProgress(0);
    const uploadInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 1000); // Update every second
    try {
      const response = await fetch("https://server.bafta.co/uploadImage", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setModalVisible(true);
        setImageURI(null);
        setUploadProgress(100); // Set progress to 100% when upload is completed
      } else {
        const responseData = await response.json();
        Alert.alert("Error", responseData.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const CustomProgressBar = ({ progress }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
        {imageURI ? (
          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.buttonText}>Change Image</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
        )}
        {/* Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <CustomProgressBar progress={uploadProgress} />
        )}
      </ScrollView>
      {imageURI && (
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.boldButtonText}>Upload Image</Text>
        </TouchableOpacity>
      )}

      {/* Success Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Image uploaded successfully!</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              navigation.navigate("Appointment");
              closeModal();
            }}
          >
            <Text style={styles.modalButtonText}>Go to Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton2}
            onPress={() => {
              navigation.navigate("ManageServiceProviders");
              closeModal();
            }}
          >
            <Text style={styles.modalButtonText}>Add Service Provider</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
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
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 0,
    marginVertical: 0,
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 0,
    marginVertical: 0,
    width: "100%",
  },
  boldButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  // Custom progress bar styles
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary, // Progress bar color
    borderRadius: 5,
  },
  // Styles for the success modal
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginVertical: 10,
  },
  modalButton2: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginVertical: 10,
  },
  modalButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ImageUpload;

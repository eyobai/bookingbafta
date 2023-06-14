import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

import firebase from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyCujg142JHu-h9i68_zS5b4Wt-466u1xmM",
  authDomain: "gizeye-20fa5.firebaseapp.com",
  projectId: "gizeye-20fa5",
  storageBucket: "gizeye-20fa5.appspot.com",
  messagingSenderId: "29032338202",
  appId: "1:29032338202:web:bc79107d3a2b8965ac12a3",
  measurementId: "G-CJRE4ZYMWV",
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage();

const Home = () => {
  const [URL, SetURL] = useState("");
  useEffect(() => {
    const func = async () => {
      const storage = getStorage();
      const reference = ref(storage, "/pagg4.jpg");
      await getDownloadURL(reference).then((x) => {
        SetURL(x);
      });
    };
    if (URL === undefined) {
      func();
    }
    func();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image style={{ width: "70%", height: "70%" }} source={{ uri: URL }} />
    </View>
  );
};

export default Home;

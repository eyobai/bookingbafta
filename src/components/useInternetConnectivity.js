import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

const useInternetConnectivity = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);

      if (!state.isConnected) {
        setShowBanner(true);

        // Hide the banner after 3 seconds
        setTimeout(() => {
          setShowBanner(false);
        }, 3000);
      }
    });
    

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, connectionType, showBanner };
};

export default useInternetConnectivity;

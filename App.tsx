import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AuthNavigator from "./src/navigators/AuthNavigator";
import { SplashScreen } from "./src/screens";
import { StatusBar } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import MainNavigator from "./src/navigators/MainNavigator";
import { useFonts } from "expo-font";
import {
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

const App = () => {
  const [isShowSlpash, setIsShowSplash] = useState(true);
  const [accsessToken, setAccsessToken] = useState("");

  const { getItem, setItem } = useAsyncStorage("accessToken");

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Roboto_300Light,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await getItem();
    if (token) {
      setAccsessToken(token);
    }
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        {isShowSlpash ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            {accsessToken ? <MainNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        )}
      </>
    );
  }
};

export default App;

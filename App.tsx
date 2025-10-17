import {
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import AppRouter from "./src/navigators/AppRouter";
import store from "./src/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Roboto_300Light,
  });

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <>
        <Provider store={store}>
          <SafeAreaProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent
            />
            <NavigationContainer>
              <AppRouter />
            </NavigationContainer>
          </SafeAreaProvider>
        </Provider>
      </>
    );
  }
};

export default App;

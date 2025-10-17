import React from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { appColor } from "../../constants/appColor";
import { authSelecter } from "../../redux/reducers/authReducer";
import { globalStyle } from "../../styles/globalStyle";
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from "../../components";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fontFamilies } from "../../constants/fontFamilies";
import AsyncStorage from "@react-native-async-storage/async-storage";
const HomeScreen = () => {
  const dispatch = useDispatch();

  const auth = useSelector(authSelecter);

  return (
    <View style={[globalStyle.container]}>
      <StatusBar barStyle={"dark-content"} />
      <ContainerComponent>
        <SectionComponent
          styles={{
            padding: StatusBar.currentHeight,
          }}
        >
          <RowComponent justify="space-between">
            <TouchableOpacity>
              <RowComponent>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 100,
                    backgroundColor: "#DFF7E2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person" color={appColor.primary} size={24} />
                </View>
                <TextComponent
                  text="Cusstomer ID"
                  font={fontFamilies.roboto_bold}
                  color={appColor.text}
                  size={16}
                  flex={1}
                  styles={{
                    marginLeft: 12,
                  }}
                />
              </RowComponent>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 100,
                  backgroundColor: "#DFF7E2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  color={appColor.primary}
                  size={24}
                />
              </View>
            </TouchableOpacity>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <View style={[{ flex: 1 }]}>
            <ButtonComponent
              text="logout"
              type="primary"
              onPress={async () => await AsyncStorage.clear()}
            />
          </View>
        </SectionComponent>
      </ContainerComponent>
    </View>
  );
};

export default HomeScreen;

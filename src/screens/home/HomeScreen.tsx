import { Feather, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerByAccount } from "../../apis/customer.api";
import {
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { appInfor } from "../../constants/appInfor";
import { fontFamilies } from "../../constants/fontFamilies";
import { authSelecter } from "../../redux/reducers/authReducer";
import { getVehicles } from "../../services/vehicle.service";
import { globalStyle } from "../../styles/globalStyle";
import ActivityComponent from "./components/ActivityComponent";
import RegularMaintenance from "./components/RegularMaintenance";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [vehicle, setVehicle] = React.useState<any>(null);
  const [customer, setCustomer] = React.useState<any>(null);
  const activityRef = useRef<any>(null);
  const maintenanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const auth = useSelector(authSelecter);
  const dispatch = useDispatch();
  const [accountId, setAccountId] = React.useState<string | null>(null);

  useEffect(() => {
    const id = auth?.accountResponse?.id || auth?.id || null;
    setAccountId(id);
  }, [auth]);

  useEffect(() => {
    if (accountId) {
      fetchCustomer(accountId);
    }
  }, [accountId]);

  useFocusEffect(
    useCallback(() => {
      if (accountId) {
        fetchCustomer(accountId);
      }
      activityRef.current?.refetch?.();
      maintenanceRef.current?.refetch?.();
    }, [accountId])
  );

  useEffect(() => {
    if (customer?.id) {
      fetchVehicle();
    } else {
      setIsLoading(false);
    }
  }, [customer]);

  const fetchCustomer = async (accountId: string) => {
    setIsLoading(true);
    try {
      const res = await getCustomerByAccount(accountId);
      if (res.success) {
        setCustomer(res.data);
      } else {
        console.log("Fetch customer failed:", res.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Fetch customer error:", error);
      setIsLoading(false);
    }
  };

  const fetchVehicle = async () => {
    try {
      const res = await getVehicles({ customerId: customer.id });
      if (res.success) {
        if (res.data.rowDatas.length > 0) {
          const vehicleData = res.data.rowDatas[0];
          setVehicle(vehicleData);
        } else {
          setVehicle(null);
        }
      } else {
        console.log("Fetch vehicles failed:", res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: appColor.white,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusBar barStyle={"dark-content"} />
        <ActivityIndicator size="large" color={appColor.primary} />
        <SpaceComponent height={12} />
        <TextComponent text="Đang tải dữ liệu..." size={16} />
      </View>
    );
  }

  return (
    <View style={[globalStyle.container]}>
      <StatusBar barStyle={"dark-content"} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionComponent
          styles={{
            padding: Platform.OS == "android" ? StatusBar.currentHeight : 44,
            paddingBottom: 12,
          }}
        >
          <RowComponent justify="space-between">
            <RowComponent
              onPress={() => {
                console.log("Profile button pressed");
                try {
                  navigation.navigate("ProfileScreen");
                } catch (error) {
                  console.log("Navigation error:", error);
                }
              }}
            >
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
                text={customer?.customerCode || "Khách hàng mới"}
                font={fontFamilies.roboto_bold}
                color={appColor.text}
                size={16}
                styles={{
                  marginLeft: 12,
                }}
              />
            </RowComponent>
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
        {/* Vehicle section */}
        <SectionComponent
          styles={{
            marginLeft: -8,
            marginRight: -8,
            minHeight: !vehicle ? appInfor.size.height - 220 : 300,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {vehicle ? (
            <View style={{ alignItems: "center", width: "100%" }}>
              <Image
                source={require("../../assets/images/vehicles/image.png")}
                style={{
                  width: "100%",
                  height: 500,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -38,
                }}
                resizeMode="contain"
              />
              <View
                style={{ paddingHorizontal: 16, width: "100%", marginTop: -20 }}
              >
                <ButtonComponent
                  text="Xem thêm thông tin xe"
                  type="primary"
                  onPress={() => {
                    console.log("Button pressed, vehicle:", vehicle);
                    navigation.navigate("Vehicles", {
                      screen: "VehicleDetail",
                      params: { id: vehicle?.id },
                    });
                  }}
                  icon={
                    <Feather name="info" size={20} color={appColor.white} />
                  }
                />
              </View>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/vehicles/vehicle-placeholder-e.jpg")}
                style={{ width: 280, height: 140 }}
                resizeMode="contain"
              />
              <TextComponent
                text="Bạn chưa có xe"
                size={20}
                font={fontFamilies.roboto_medium}
                color={appColor.primary}
                styles={{ textAlign: "center" }}
              />
              <TextComponent
                text="Hãy xác thực và thêm xe"
                size={18}
                color={appColor.text}
                font={fontFamilies.roboto_regular}
                styles={{ textAlign: "center", marginTop: 8 }}
              />
              <ButtonComponent
                text="Liên kết xe của bạn"
                type="primary"
                onPress={() => {
                  navigation.navigate("Vehicles", {
                    screen: "AddVehicle",
                    params: { accountId: accountId },
                  });
                }}
                iconFlex="right"
                icon={<Feather name="plus" size={20} color={appColor.white} />}
                styles={{ marginTop: 20, width: "70%" }}
              />
            </View>
          )}
        </SectionComponent>

        {/* Regular maintenance section */}
        {vehicle != null ? (
          <SectionComponent
            styles={[
              globalStyle.shadow,
              {
                marginTop: -24,
                backgroundColor: appColor.white,
                borderWidth: 0.5,
                borderColor: appColor.gray,
                padding: 16,
                borderRadius: 12,
                marginHorizontal: 8,
              },
            ]}
          >
            <TextComponent
              text="Bảo dưỡng định kỳ"
              size={20}
              color={appColor.primary}
              font={fontFamilies.roboto_medium}
            />
            <View
              style={{
                height: 1.2,
                backgroundColor: appColor.gray,
                marginVertical: 8,
              }}
            />
            <RegularMaintenance
              ref={maintenanceRef}
              navigation={navigation}
              vehicleId={vehicle?.id}
            />
          </SectionComponent>
        ) : null}
        <SpaceComponent height={24} />
        <SectionComponent>
          <View style={localStyles.quickActionsRow}>
            <TouchableOpacity
              style={[
                localStyles.quickAction,
                { backgroundColor: appColor.gray },
              ]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Vehicles", { screen: "VehicleHistory" })
              }
            >
              <Octicons name="history" size={28} color={appColor.primary} />
              <TextComponent
                text="Lịch sử"
                size={14}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                styles={{ marginTop: 8 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                localStyles.quickAction,
                { backgroundColor: appColor.white },
              ]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Batteries", {
                  screen: "BatteryScreen",
                  params: { id: vehicle?.id },
                })
              }
            >
              <Feather
                name="battery-charging"
                size={28}
                color={appColor.primary}
              />
              <TextComponent
                text="Pin xe"
                size={14}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                styles={{ marginTop: 8 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                localStyles.quickAction,
                { backgroundColor: appColor.warning },
              ]}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="miscellaneous-services"
                size={28}
                color={appColor.primary}
              />
              <TextComponent
                text="Trung tâm"
                size={14}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                styles={{ marginTop: 8 }}
              />
            </TouchableOpacity>
          </View>
        </SectionComponent>

        <SpaceComponent height={40} />

        {vehicle && (
          <SectionComponent
            styles={[
              globalStyle.shadow,
              {
                marginTop: -24,
                backgroundColor: appColor.white,
                borderWidth: 0.5,
                borderColor: appColor.gray,
                padding: 16,
                borderRadius: 12,
                marginHorizontal: 8,
              },
            ]}
          >
            <TextComponent
              text="Hoạt động gần đây"
              size={20}
              color={appColor.primary}
              font={fontFamilies.roboto_medium}
            />
            <View
              style={{
                height: 1.2,
                backgroundColor: appColor.gray,
                marginVertical: 8,
              }}
            />
            <ActivityComponent ref={activityRef} customerId={customer?.id} />
          </SectionComponent>
        )}

        <SpaceComponent height={80} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const localStyles = StyleSheet.create({
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 6,
    backgroundColor: appColor.white,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
});

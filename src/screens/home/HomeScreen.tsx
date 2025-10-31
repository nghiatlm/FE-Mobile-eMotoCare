import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
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
import { authSelecter, removeAuth } from "../../redux/reducers/authReducer";
import { getCustomerByAccount } from "../../services/customer.service";
import { getVehicle } from "../../services/vehicle.service";
import { globalStyle } from "../../styles/globalStyle";
import { getMaintenances } from "../../services/maintenance.service";

interface CustomerType {
  id?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  [key: string]: any;
}

const HomeScreen = ({ navigation }: any) => {
  const [selectedMaintenance, setSelectedMaintenance] = useState(0);
  const [vehicle, setVehicle] = useState<any>(null);
  const [customer, setCustomer] = useState<CustomerType | null>(null);

  const auth = useSelector(authSelecter);
  const dispatch = useDispatch();
  const [accountId, setAccountId] = useState("");
  const [vehicleMaintenance, setVehicleMaintenance] = useState<any>(null);

  const [mainDetailId, setMainDetailId] = useState(1);

  const maintenanceItems = [
    {
      id: 0,
      title: "Lịch bảo dưỡng tháng 12",
      date: "20/12/2024",
      status: "COMPLETED",
      pillColor: appColor.primary,
      cardBg: appColor.success50,
      statusColor: appColor.primary,
    },
    {
      id: 1,
      title: "Lịch bảo dưỡng tháng 01",
      date: "15/01/2025",
      status: "COMPLETED",
      pillColor: appColor.primary,
      cardBg: appColor.success50,
      statusColor: appColor.primary,
    },
    {
      id: 2,
      title: "Lịch bảo dưỡng tháng 02",
      date: "10/02/2025",
      status: "Quá hạn",
      pillColor: appColor.danger,
      cardBg: appColor.danger50,
      statusColor: appColor.danger,
    },
    {
      id: 3,
      title: "Lịch bảo dưỡng tháng 03",
      date: "05/03/2025",
      status: "Sắp tới",
      pillColor: appColor.warning,
      cardBg: appColor.warning2,
      statusColor: appColor.warning,
    },
    {
      id: 4,
      title: "Lịch bảo dưỡng tháng 04",
      date: "01/04/2025",
      status: "Chưa thực hiện",
      pillColor: appColor.gray,
      cardBg: appColor.white,
      statusColor: appColor.gray,
    },
    {
      id: 5,
      title: "Lịch bảo dưỡng tháng 05",
      date: "20/05/2025",
      status: "Chưa thực hiện",
      pillColor: appColor.gray,
      cardBg: appColor.white,
      statusColor: appColor.gray,
    },
    {
      id: 6,
      title: "Lịch bảo dưỡng tháng 06",
      date: "30/06/2025",
      status: "Chưa thực hiện",
      pillColor: appColor.gray,
      cardBg: appColor.white,
      statusColor: appColor.gray,
    },
  ];

  useEffect(() => {
    const id = auth.accountResponse?.id ?? "";
    setAccountId(id);
    if (!id || String(id).trim() === "") return;

    const loadCustomer = async () => {
      await fetchCustomer(String(id).trim());
    };
    loadCustomer();
  }, [auth]);

  useEffect(() => {
    if (!customer?.id) return;
    fetchVehicle();
  }, [customer]);

  useEffect(() => {
    if (!vehicle?.id) return;
    fetchMaintenances();
  }, [vehicle]);

  const fetchCustomer = async (id: string) => {
    try {
      const res = await getCustomerByAccount(id);
      if (res.success) {
        setCustomer(res.data);
      } else {
        setCustomer(null);
      }
    } catch (e) {
      setCustomer(null);
      console.error("fetchCustomer error:", e);
    }
  };

  const fetchVehicle = async () => {
    if (!customer?.id) return;

    const params = {
      customerId: String(customer.id),
      page: 1,
      pageSize: 10,
      search: undefined,
      status: undefined,
      modelId: undefined,
      fromPurchaseDate: undefined,
      toPurchaseDate: undefined,
    };

    try {
      const res = await getVehicle(params);
      if (res.success) {
        const data = res.data?.rowDatas[0];
        setVehicle(data);
      } else {
        console.warn("fetchVehicle:", res.message);
      }
    } catch (e) {
      console.error("fetchVehicle error:", e);
    }
  };

  const fetchMaintenances = async () => {
    if (!vehicle?.id) return;
    const params = {
      vehicleId: String(vehicle.id),
      page: 1,
      pageSize: 10,
    };
    try {
      const res = await getMaintenances(params);
      if (res.success) {
        setVehicleMaintenance(res.data?.rowDatas ?? []);
        console.log("Fetched maintenance data:", vehicleMaintenance);
      } else {
        console.warn("fetchMaintenances:", res.message);
      }
    } catch (e) {
      console.error("fetchMaintenances error:", e);
    }
  };

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
                  text={customer?.firstName ?? ""}
                  font={fontFamilies.roboto_bold}
                  color={appColor.text}
                  size={16}
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
          <View style={{ alignItems: "center" }}>
            <View style={{ width: appInfor.size.width, height: 450 }}>
              <Image
                source={require("../../assets/images/vehicles/image.png")}
                style={{
                  borderRadius: 12,
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 20,
                  marginLeft: "50%",
                  transform: [{ translateX: "-50%" }],
                  backgroundColor: "#E8F5FF",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "#D1E9FF",
                }}
              >
                <TextComponent text={vehicle?.vinNumber} size={12} />
              </View>

              <ButtonComponent
                text="Xem thêm"
                type="link"
                styles={{
                  position: "absolute",
                  marginLeft: "50%",
                  transform: [{ translateX: "-50%" }],
                  bottom: -16,
                  backgroundColor: appColor.white,
                  borderWidth: 1,
                  borderColor: appColor.gray,
                  borderRadius: 40,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                }}
              />
            </View>
          </View>
        </SectionComponent>
        <SpaceComponent height={20} />
        <SectionComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              padding: 16,
              borderRadius: 12,
              marginHorizontal: 8,
            },
          ]}
        >
          <View>
            <TextComponent
              text="Bảo dưỡng định kỳ"
              title
              font={fontFamilies.roboto_bold}
              color={appColor.primary}
            />
            <View style={styles.line} />
            <RowComponent justify="space-between">
              {maintenanceItems.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedMaintenance(idx)}
                  activeOpacity={0.8}
                  style={{
                    // nếu là item được chọn, tăng viền
                    borderWidth: selectedMaintenance === idx ? 2 : 0,
                    borderColor:
                      selectedMaintenance === idx
                        ? maintenanceItems[selectedMaintenance].pillColor
                        : "transparent",
                    borderRadius: 20,
                    padding: 2,
                  }}
                >
                  <View
                    style={[
                      styles.maintenanceStatus,
                      {
                        backgroundColor: item.pillColor,
                        width: 46,
                        height: 20,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </RowComponent>
            <SpaceComponent height={12} />
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                padding: 12,
                backgroundColor: maintenanceItems[selectedMaintenance].cardBg,
                borderWidth: 1,
                borderColor: maintenanceItems[selectedMaintenance].statusColor,
                borderRadius: 8,
              }}
              onPress={() => {
                navigation.navigate("MaintenanceDetail", {
                  maintenanceId: mainDetailId,
                });
              }}
            >
              <TextComponent
                text={maintenanceItems[selectedMaintenance].title}
                size={18}
                color={appColor.text}
              />
              <RowComponent justify="flex-start" styles={{ marginTop: 8 }}>
                <TextComponent text="Thời gian: " size={18} />
                <TextComponent
                  text={maintenanceItems[selectedMaintenance].date}
                  size={18}
                  font={fontFamilies.roboto_bold}
                  styles={{ marginLeft: 4 }}
                />
              </RowComponent>
              <RowComponent justify="flex-start" styles={{ marginTop: 8 }}>
                <TextComponent text="Trạng thái: " size={18} />
                <TextComponent
                  text={maintenanceItems[selectedMaintenance].status}
                  size={18}
                  font={fontFamilies.roboto_bold}
                  styles={{ marginLeft: 4 }}
                />
              </RowComponent>
            </TouchableOpacity>
          </View>
        </SectionComponent>

        <SectionComponent>
          <View style={[{ flex: 1 }]}>
            <ButtonComponent
              text="logout"
              type="primary"
              onPress={async () => {
                // xóa token/auth trên storage
                await AsyncStorage.removeItem("auth");
                await AsyncStorage.removeItem("ACCESS_TOKEN");
                // gọi action remove trong redux
                dispatch(removeAuth());
                // tuỳ chọn: chuyển về màn hình login
                // navigation.replace("Login");
              }}
            />
          </View>
        </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: appColor.gray,
    marginVertical: 8,
  },
  maintenanceStatus: {
    height: 20,
    width: 46,
    backgroundColor: appColor.primary,
    borderRadius: 20,
  },
});

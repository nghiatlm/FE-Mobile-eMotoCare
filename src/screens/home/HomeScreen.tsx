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
import ActivityComponent from "./components/ActivityComponent";
import { getAppointments } from "../../services/appointment.service";

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
  const [activity, setActivity] = useState<any[]>([]);

  const auth = useSelector(authSelecter);
  const dispatch = useDispatch();
  const [accountId, setAccountId] = useState("");
  const [vehicleMaintenance, setVehicleMaintenance] = useState<any[]>([]);
  const [mainDetailId, setMainDetailId] = useState<string | number | null>(
    null
  );

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
        fetchActivity();
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
        const rows = res.data?.rowDatas ?? [];
        setVehicleMaintenance(rows);
        // reset selection to first item and set mainDetailId tương ứng
        if (rows.length > 0) {
          setSelectedMaintenance(0);
          setMainDetailId(rows[0].id ?? null);
        } else {
          setSelectedMaintenance(0);
          setMainDetailId(null);
        }
        // console.log("Fetched maintenance data:", rows);
      } else {
        console.warn("fetchMaintenances:", res.message);
      }
    } catch (e) {
      console.error("fetchMaintenances error:", e);
    }
  };

  const fetchActivity = async () => {
    const params = {
      customerId: customer?.id,
      page: 1,
      pageSize: 10,
    };
    const result = await getAppointments(params);
    if (result?.success) {
      console.log("Fetched appointments for activity:", result.data);
      setActivity(result.data?.rowDatas || []);
    } else {
      console.warn("fetchActivity:", result?.message || "Unknown error");
    }
  };

  // chuẩn hoá dữ liệu để render (chỉ từ API)
  const displayed =
    Array.isArray(vehicleMaintenance) && vehicleMaintenance.length > 0
      ? vehicleMaintenance.map((m: any, idx: number) => {
          const date = m?.dateOfImplementation
            ? new Date(m.dateOfImplementation).toLocaleDateString()
            : "Chưa có ngày";
          const status = m?.status ?? "NO_START";
          const pillColor =
            status === "COMPLETED"
              ? appColor.primary
              : status === "UPCOMING"
              ? appColor.warning
              : status === "OVERDUE" || status === "EXPIRED"
              ? appColor.danger
              : appColor.gray;
          const cardBg =
            status === "COMPLETED"
              ? appColor.success50
              : status === "UPCOMING"
              ? appColor.warning2
              : status === "OVERDUE" || status === "EXPIRED"
              ? appColor.danger50
              : appColor.white;
          const statusColor =
            status === "COMPLETED"
              ? appColor.primary
              : status === "UPCOMING"
              ? appColor.warning
              : status === "OVERDUE"
              ? appColor.danger
              : appColor.gray;

          return {
            maintenanceId: m.id ?? `local-${idx}`,
            id: m.id ?? idx,
            title: m.title ?? `Lịch bảo dưỡng ${idx + 1}`,
            date,
            status,
            pillColor,
            cardBg,
            statusColor,
            raw: m,
            maintenanceStageId: m.maintenanceStageId || null,
          };
        })
      : [];

  // đảm bảo selectedMaintenance hợp lệ khi displayed thay đổi
  useEffect(() => {
    if (!displayed || displayed.length === 0) {
      setSelectedMaintenance(0);
      return;
    }
    if (selectedMaintenance > displayed.length - 1) {
      setSelectedMaintenance(0);
    }
  }, [displayed]);

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
                  top: 18,
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
                  bottom: Platform.OS === "ios" ? -16 : -3,
                  backgroundColor: appColor.white,
                  borderWidth: 1,
                  borderColor: appColor.gray,
                  borderRadius: 40,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                }}
                onPress={() =>
                  navigation.navigate("Vehicles", {
                    screen: "VehicleDetail",
                    params: { id: vehicle?.id },
                  })
                }
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

            {displayed.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {displayed.map((item: any, idx: number) => (
                      <TouchableOpacity
                        key={item.maintenanceId ?? idx}
                        onPress={() => {
                          setSelectedMaintenance(idx);
                          setMainDetailId(item.maintenanceId ?? null);
                        }}
                        activeOpacity={0.8}
                        style={{
                          borderWidth: selectedMaintenance === idx ? 2 : 0,
                          borderColor:
                            selectedMaintenance === idx
                              ? item.pillColor
                              : "transparent",
                          borderRadius: 20,
                          padding: 2,
                          marginRight: 8,
                          minWidth: 46,
                          maxWidth: 60,
                          alignItems: "center",
                          justifyContent: "center",
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
                  </View>
                </ScrollView>

                <SpaceComponent height={12} />

                {displayed[selectedMaintenance] ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      padding: 12,
                      backgroundColor: displayed[selectedMaintenance].cardBg,
                      borderWidth: 1,
                      borderColor: displayed[selectedMaintenance].statusColor,
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      const maintenanceStageId =
                        displayed[selectedMaintenance]?.maintenanceStageId ??
                        mainDetailId;
                      const stage = displayed[selectedMaintenance]?.id;
                      if (!maintenanceStageId) {
                        console.warn("No maintenance id to navigate");
                        return;
                      }
                      navigation.navigate("MaintenanceDetail", {
                        maintenanceStageId,
                        stage,
                      });
                      console.log(
                        "Navigate to maintenanceId:",
                        maintenanceStageId
                      );
                    }}
                  >
                    <TextComponent
                      text={displayed[selectedMaintenance].title}
                      size={18}
                      color={appColor.text}
                    />
                    <RowComponent
                      justify="flex-start"
                      styles={{ marginTop: 8 }}
                    >
                      <TextComponent text="Thời gian: " size={18} />
                      <TextComponent
                        text={displayed[selectedMaintenance].date}
                        size={18}
                        font={fontFamilies.roboto_bold}
                        styles={{ marginLeft: 4 }}
                      />
                    </RowComponent>
                    <RowComponent
                      justify="flex-start"
                      styles={{ marginTop: 8 }}
                    >
                      <TextComponent text="Trạng thái: " size={18} />
                      <TextComponent
                        text={displayed[selectedMaintenance].status}
                        size={18}
                        font={fontFamilies.roboto_bold}
                        styles={{ marginLeft: 4 }}
                      />
                    </RowComponent>
                  </TouchableOpacity>
                ) : (
                  <TextComponent text="Không có lịch bảo dưỡng" size={14} />
                )}
              </>
            ) : (
              <TextComponent text="Không có lịch bảo dưỡng" size={14} />
            )}
            <SpaceComponent height={12} />
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
              borderWidth: 1,
              borderColor: appColor.gray,
            },
          ]}
        >
          <TextComponent
            text="Lịch sử hoạt động"
            title
            size={20}
            color={appColor.primary}
          />
          <View style={styles.line} />
          <ActivityComponent activities={activity} />
          <ButtonComponent
            text="xem thêm"
            type="link"
            styles={[{ alignItems: "center" }]}
          />
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
                // dispatch(removeAuth());
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
    height: 1.2,
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

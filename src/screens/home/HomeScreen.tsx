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
  ActivityIndicator,
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
import { fontFamilies } from "../../constants/fontFamilies";
import { authSelecter } from "../../redux/reducers/authReducer";
import { removeAuth } from "../../redux/reducers/authReducer";
import { getAppointments } from "../../services/appointment.service";
import { getCustomerByAccount } from "../../services/customer.service";
import { getMaintenances } from "../../services/maintenance.service";
import { getVehicle } from "../../services/vehicle.service";
import { globalStyle } from "../../styles/globalStyle";
import { formatMaintenances } from "../../utils/maintenance.utils";
import ActivityComponent from "./components/ActivityComponent";
import MaintenanceSection from "./components/MaintenanceSection";

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
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);

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

    const loadAll = async () => {
      try {
        setLoadingCustomer(true);
        const custRes = await getCustomerByAccount(String(id).trim());
        if (custRes?.success) {
          const cust = custRes.data;
          setCustomer(cust);

          // fetch vehicle
          setLoadingVehicle(true);
          try {
            const vehRes = await getVehicle({ customerId: String(cust.id), page: 1, pageSize: 10 });
            if (vehRes?.success) {
              const data = vehRes.data?.rowDatas[0];
              setVehicle(data);

              // fetch maintenances for vehicle
              if (data?.id) {
                setLoadingMaintenance(true);
                try {
                  const maintRes = await getMaintenances({ vehicleId: String(data.id), page: 1, pageSize: 10 });
                  if (maintRes?.success) {
                    const rows = maintRes.data?.rowDatas ?? [];
                    setVehicleMaintenance(rows);
                    if (rows.length > 0) {
                      setSelectedMaintenance(0);
                      setMainDetailId(rows[0].id ?? null);
                    } else {
                      setSelectedMaintenance(0);
                      setMainDetailId(null);
                    }
                  }
                } catch (e) {
                  console.warn("fetchMaintenances error:", e);
                } finally {
                  setLoadingMaintenance(false);
                }
              }
            }
          } catch (e) {
            console.warn("fetchVehicle error:", e);
          } finally {
            setLoadingVehicle(false);
          }

          // fetch maintenances for vehicle (handled above while vehicle was set)

          // fetch activities AFTER vehicle + maintenances to follow top-down order
          setLoadingActivity(true);
          try {
            const actRes = await getAppointments({ customerId: cust.id, page: 1, pageSize: 10 });
            if (actRes?.success) setActivity(actRes.data?.rowDatas || []);
          } catch (e) {
            console.warn("fetchActivity error:", e);
          } finally {
            setLoadingActivity(false);
          }
        }
      } catch (e) {
        console.error("loadAll error:", e);
      } finally {
        setLoadingCustomer(false);
      }
    };
    loadAll();
  }, [auth]);

  useEffect(() => {
    if (loadingVehicle || loadingCustomer) return;
    if (!customer?.id) return;
    if (vehicle) return;
    fetchVehicle();
  }, [customer]);

  useEffect(() => {
    if (loadingMaintenance || loadingVehicle) return;
    if (!vehicle?.id) return;
    if (vehicleMaintenance && vehicleMaintenance.length > 0) return;
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
  const displayed = formatMaintenances(vehicleMaintenance);

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
          <View style={styles.vehicleCardWrap}>
            <View style={styles.vehicleCard}>
              {loadingVehicle ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color={appColor.primary} />
                </View>
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/vehicles/image.png")}
                    style={styles.vehicleImage}
                  />
                  <View style={styles.vehicleInfo}>
                    <TextComponent text={vehicle?.modelName ?? "Xe của bạn"} size={18} font={fontFamilies.roboto_bold} color={appColor.text} />
                    <TextComponent text={`Biển số: ${vehicle?.chassisNumber ?? "-"}`} size={13} color={appColor.gray} styles={{ marginTop: 6 }} />
                    <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
                      <ButtonComponent
                        text="Chi tiết xe"
                        type="text"
                        onPress={() => navigation.navigate("Vehicles", { screen: "VehicleDetail", params: { id: vehicle?.id } })}
                        styles={{ paddingHorizontal: 12, marginRight: 8 }}
                      />
                      <ButtonComponent
                        text="Lịch sử"
                        type="link"
                        onPress={() => navigation.navigate('Maintenance')}
                        styles={{ paddingHorizontal: 8 }}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </SectionComponent>
        <SpaceComponent height={20} />
        <MaintenanceSection
          displayed={displayed}
          selectedMaintenance={selectedMaintenance}
          setSelectedMaintenance={setSelectedMaintenance}
          mainDetailId={mainDetailId}
          setMainDetailId={setMainDetailId}
          navigation={navigation}
          loading={loadingMaintenance}
        />

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
          <ActivityComponent activities={activity} loading={loadingActivity} />
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
                //gọi action remove trong redux
                dispatch(removeAuth({} as any));
                //tuỳ chọn: chuyển về màn hình login
                navigation.replace("LoginScreen");
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
  vehicleCardWrap: {
    paddingHorizontal: 6,
  },
  vehicleCard: {
    flexDirection: "row",
    backgroundColor: appColor.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center'
  },
  vehicleImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 12,
    backgroundColor: appColor.gray3
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: 'center'
  },
});

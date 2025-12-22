import React, { useEffect, useReducer, useState } from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";
import ChooseVehicle from "./components/ChooseVehicle";
import { Vehicle } from "../../types/vehicle.type";
import { View, StyleSheet, Platform, TextInput } from "react-native";
import { BrifecaseTimer, CalendarTick } from "iconsax-react-nativejs";
import { AntDesign } from "@expo/vector-icons";
import SelectCenterStep from "./components/SelectCenterStep";
import SelectTimeStep from "./components/SelectTimeStep";
import ConfirmStep from "./components/ConfirmStep";
import { useSelector } from "react-redux";
import { authSelecter } from "../../redux/reducers/authReducer";
import { createAppointment } from "../../services/appointment.service";
import { getVehicles } from "../../services/vehicle.service";
import { getCustomerByAccount } from "../../apis/customer.api";

type RepairFormState = {
  serviceCenterId?: string;
  customerId?: string;
  vehicleId?: string;
  appointmentDate?: string;
  slotTime?: string;
  type?: string;
  note?: string;
};

const initState: RepairFormState = {
  serviceCenterId: "",
  customerId: "",
  vehicleId: "",
  appointmentDate: "",
  slotTime: "",
  type: "REPAIR_TYPE",
  note: "",
};

/* --- reducer --- */
function reducer(state: RepairFormState, action: any): RepairFormState {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload };
    case "RESET":
      return { ...initState };
    default:
      return state;
  }
}

/* --- component --- */
const CreateRepairScreen = ({ navigation }: any) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [vehicleSelectId, setVehicleSelectId] = useState<string>(
    initState.vehicleId ?? ""
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [serviceCenter, setServiceCenter] = useState<any>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // stack of snapshots for "Quay lại"
  const [prevStack, setPrevStack] = useState<RepairFormState[]>([]);

  const auth = useSelector(authSelecter);

  const [accountId, setAccountId] = useState(auth.accountResponse?.id || "");
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomer();
  }, [accountId]);

  useEffect(() => {
    fetchVehicles();
  }, [customer]);

  const fetchCustomer = async () => {
    if (!accountId) return;
    const res = await getCustomerByAccount(accountId);
    if (res.success) {
      console.log("Customer data:", res.data);
      setCustomer(res.data);
      dispatch({ type: "SET", payload: { customerId: res.data?.id || "" } });
    } else {
      console.log("Failed to fetch customer:", res.message);
    }
  };

  const fetchVehicles = async () => {
    if (!customer || !customer.id) return;
    const params = {
      customerId: customer.id,
      page: 1,
      pageSize: 10,
    };

    try {
      const res = await getVehicles(params);
      console.log("Fetch vehicles response:", res);

      if (res && res.success) {
        const rows = res.data?.rowDatas ?? [];
        console.log("Raw rows from API:", rows);
        const items: Vehicle[] = rows.map((r: any) => {
          if (Array.isArray(r) && r.length > 0) return r[0];
          return r;
        });

        setVehicles(items);
        if (items.length > 0) {
          setVehicleSelectId(String(items[0].id));
          setVehicle(items[0]);
          dispatch({
            type: "SET",
            payload: { vehicleId: String(items[0].id) },
          });
        }
      } else {
        console.log("Failed to fetch vehicles:", res?.message);
      }
    } catch (err) {
      console.log("Error fetching vehicles:", err);
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setVehicleSelectId(String(vehicle.id));
    setVehicle(vehicle);
    setErrorMessage("");
  };

  const handleNextStep = () => {
    if (step === 0 && !vehicleSelectId) {
      setErrorMessage("Vui lòng chọn xe để tiếp tục.");
      return;
    }

    // push current state snapshot
    setPrevStack((s) => [...s, state]);

    // commit changes depending on step
    if (step === 0) {
      dispatch({
        type: "SET",
        payload: { vehicleId: String(vehicleSelectId) },
      });
    }

    // example: other step commits can be added here

    setErrorMessage("");
    setStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => {
    setPrevStack((s) => {
      if (s.length === 0) {
        setStep((st) => Math.max(0, st - 1));
        return s;
      }
      const last = s[s.length - 1];
      dispatch({ type: "SET", payload: last });
      setStep((st) => Math.max(0, st - 1));
      return s.slice(0, -1);
    });
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    console.log("Submit booking:", state);
    const result = await createAppointment(state);
    console.log("Create appointment result:", result.message);
    if (result.success) {
      console.log("Success: ", result.data);
      navigation.navigate("WaitConfirm", { id: result.data.id });
    } else {
      console.log("Failed: ", result.message);
    }
  };

  const footer = (() => {
    if (step === 3) {
      return (
        <View style={styles.footerContainer}>
          <ButtonComponent
            text="Đặt lịch"
            type="primary"
            onPress={handleSubmit}
          />
        </View>
      );
    }

    if (step === 1) {
      return (
        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>
            <View style={styles.footerBtn}>
              <ButtonComponent
                text="Quay lại"
                type="secondary"
                onPress={handleBack}
              />
            </View>
            <View style={styles.footerBtn}>
              <ButtonComponent
                text="Tiếp tục"
                type="primary"
                onPress={handleNextStep}
              />
            </View>
          </View>
        </View>
      );
    }

    // default for step 0,2,3
    return (
      <View style={styles.footerContainer}>
        <ButtonComponent
          text="Tiếp tục"
          type="primary"
          onPress={handleNextStep}
        />
      </View>
    );
  })();

  return (
    <BackgroundComponent
      title="Đặt lịch sửa chữa"
      isScroll
      back
      footer={footer}
    >
      <SectionComponent styles={{ marginTop: 20 }}>
        {step === 0 && (
          <>
            <TextComponent
              text="Đặt lịch sửa chữa"
              size={18}
              font={fontFamilies.roboto_medium}
              color={appColor.primary}
              styles={{ textAlign: "center" }}
            />
            <SpaceComponent height={8} />
            <TextComponent
              text="Đặt lịch sửa chữa nhanh chống tiện lợi"
              size={14}
              color={appColor.gray2}
              styles={{ textAlign: "center" }}
            />
            <SpaceComponent height={20} />
          </>
        )}

        {step !== 0 && (
          <RowComponent justify="space-between">
            {(() => {
              const done0 = step >= 1;
              return (
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done0
                        ? appColor.primary
                        : appColor.white,
                      borderWidth: 1.5,
                      borderColor: done0 ? appColor.primary : appColor.gray,
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  >
                    <BrifecaseTimer
                      size={24}
                      color={done0 ? appColor.white : appColor.gray}
                      variant="Outline"
                    />
                  </View>
                  <SpaceComponent height={4} />
                  <TextComponent
                    text="Trung tâm"
                    font={fontFamilies.roboto_regular}
                    size={16}
                    color={done0 ? appColor.primary : appColor.text}
                  />
                </View>
              );
            })()}

            {(() => {
              const done1 = step >= 2;
              return (
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done1
                        ? appColor.primary
                        : appColor.white,
                      borderWidth: 1.5,
                      borderColor: done1 ? appColor.primary : appColor.gray,
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  >
                    <CalendarTick
                      size="28"
                      color={done1 ? appColor.white : appColor.gray}
                      variant="Outline"
                    />
                  </View>
                  <SpaceComponent height={4} />
                  <TextComponent
                    text="Thời gian"
                    font={fontFamilies.roboto_regular}
                    size={16}
                    color={done1 ? appColor.primary : appColor.text}
                  />
                </View>
              );
            })()}

            {(() => {
              const done2 = step >= 3;
              return (
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done2
                        ? appColor.primary
                        : appColor.white,
                      borderWidth: 1.5,
                      borderColor: done2 ? appColor.primary : appColor.gray,
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  >
                    <AntDesign
                      name="check-circle"
                      size={28}
                      color={done2 ? appColor.white : appColor.gray}
                    />
                  </View>
                  <SpaceComponent height={4} />
                  <TextComponent
                    text="Xác nhận"
                    font={fontFamilies.roboto_regular}
                    size={16}
                    color={done2 ? appColor.primary : appColor.text}
                  />
                </View>
              );
            })()}
          </RowComponent>
        )}
      </SectionComponent>

      {step === 0 && (
        <>
          {vehicles.length === 0 ? (
            <TextComponent
              text="Bạn chưa có xe. Vui lòng thêm xe để đặt lịch."
              size={14}
              color={appColor.gray2}
              styles={{ textAlign: "center" }}
            />
          ) : (
            // use `key` so ChooseVehicle remounts when `vehicleSelectId` changes
            <ChooseVehicle
              key={vehicleSelectId || "choose-vehicle"}
              vehicles={vehicles}
              onSelect={handleSelectVehicle}
              initialSelectedId={vehicleSelectId}
              errorMessage={errorMessage}
            />
          )}

          <SectionComponent>
            <TextComponent
              text="Mô tả tình trạng hiện tại"
              size={16}
              font={fontFamilies.roboto_regular}
              color={appColor.text}
            />
            <SpaceComponent height={12} />
            <TextInput
              style={styles.textArea}
              value={state.note ?? ""}
              onChangeText={(text) =>
                dispatch({ type: "SET", payload: { note: text } })
              }
              placeholder="Nhập trình trạng xe"
              placeholderTextColor={appColor.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </SectionComponent>
        </>
      )}

      {step === 1 && (
        <SelectCenterStep
          state={state}
          onSelectCenter={(center: any) => {
            setServiceCenter(center);
            // commit center and go to next step
            setPrevStack((s) => [...s, state]);
            dispatch({
              type: "SET",
              payload: { serviceCenterId: center?.id ?? "" },
            });
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <SelectTimeStep
          state={state}
          dispatch={dispatch}
          center={serviceCenter}
        />
      )}
      {step === 3 && (
        <ConfirmStep
          state={state}
          dispatch={dispatch}
          center={serviceCenter}
          vehicle={vehicle}
        />
      )}
    </BackgroundComponent>
  );
};

export default CreateRepairScreen;

const styles = StyleSheet.create({
  footerRow: { flexDirection: "row", gap: 8, width: "100%" },
  footerBtn: { flex: 1 },
  footerContainer: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === "android" ? 48 : 16,
    backgroundColor: "transparent",
  },
  textArea: {
    borderWidth: 1,
    borderColor: appColor.gray,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    backgroundColor: "#fff",
    color: appColor.text,
  },
});

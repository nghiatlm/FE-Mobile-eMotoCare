import React, { useEffect, useReducer, useState } from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";
import ChooseVehicle from "./components/ChooseVehicle";
import { Vehicle } from "../../types/vehicle.type";
import { View, StyleSheet } from "react-native";
import { BrifecaseTimer, CalendarTick } from "iconsax-react-nativejs";
import { AntDesign } from "@expo/vector-icons";
import SelectCenterStep from "./components/SelectCenterStep";
import SelectTimeStep from "./components/SelectTimeStep";
import ConfirmStep from "./components/ConfirmStep";
import { getCustomerByAccount } from "../../services/customer.service";
import { useSelector } from "react-redux";
import { authSelecter } from "../../redux/reducers/authReducer";
import { CreateAppointment } from "../../services/appointment.service";

/* --- fake vehicles --- */
const vehicles: Vehicle[] = [
  {
    id: "3asđsdgàqw2",
    purchaseDate: "2022-06-01T00:00:00.000Z",
    warrantyExpiry: "2024-06-01T00:00:00.000Z",
    model: {
      id: "m1",
      code: "VF-E34",
      name: "EvoGrand - 123235346",
      manufacturer: "VinFast",
      maintenancePlanId: "",
    },
    vinNUmber: "",
    image: "",
    color: "",
    chassisNumber: "",
    engineNumber: "",
    status: "",
    manufactureDate: "",
    modelId: "m1",
    customerId: "",
    customer: {
      id: "",
      firstName: "",
      lastName: "",
      address: "",
      citizenId: "",
      dateOfBirth: "",
      gender: "",
      avatarUrl: "",
      accountId: "",
    },
  },
  {
    id: "asdasd123213",
    purchaseDate: "2020-03-15T00:00:00.000Z",
    warrantyExpiry: "2021-03-15T00:00:00.000Z",
    model: {
      id: "m2",
      code: "KY-I1",
      name: "EvoSport - 987654321",
      manufacturer: "KYMCO",
      maintenancePlanId: "",
    },
    vinNUmber: "",
    image: "",
    color: "",
    chassisNumber: "",
    engineNumber: "",
    status: "",
    manufactureDate: "",
    modelId: "m2",
    customerId: "",
    customer: {
      id: "",
      firstName: "",
      lastName: "",
      address: "",
      citizenId: "",
      dateOfBirth: "",
      gender: "",
      avatarUrl: "",
      accountId: "",
    },
  },
  {
    id: "zxcqwe456789",
    purchaseDate: "2023-01-10T00:00:00.000Z",
    warrantyExpiry: "2025-01-10T00:00:00.000Z",
    model: {
      id: "m3",
      code: "EV-CITY",
      name: "EvoCity - 456123789",
      manufacturer: "Generic",
      maintenancePlanId: "",
    },
    vinNUmber: "",
    image: "",
    color: "",
    chassisNumber: "",
    engineNumber: "",
    status: "",
    manufactureDate: "",
    modelId: "m3",
    customerId: "",
    customer: {
      id: "",
      firstName: "",
      lastName: "",
      address: "",
      citizenId: "",
      dateOfBirth: "",
      gender: "",
      avatarUrl: "",
      accountId: "",
    },
  },
  {
    id: "fgdg",
    purchaseDate: "2023-01-10T00:00:00.000Z",
    warrantyExpiry: "2025-01-10T00:00:00.000Z",
    model: {
      id: "m3",
      code: "EV-CITY",
      name: "EvoCity - 456123789",
      manufacturer: "Generic",
      maintenancePlanId: "",
    },
    vinNUmber: "",
    image: "",
    color: "",
    chassisNumber: "",
    engineNumber: "",
    status: "",
    manufactureDate: "",
    modelId: "m3",
    customerId: "",
    customer: {
      id: "",
      firstName: "",
      lastName: "",
      address: "",
      citizenId: "",
      dateOfBirth: "",
      gender: "",
      avatarUrl: "",
      accountId: "",
    },
  },
  {
    id: "zxcqsdgsdge456789",
    purchaseDate: "2023-01-10T00:00:00.000Z",
    warrantyExpiry: "2025-01-10T00:00:00.000Z",
    model: {
      id: "m3",
      code: "EV-CITY",
      name: "EvoCity - 456123789",
      manufacturer: "Generic",
      maintenancePlanId: "",
    },
    vinNUmber: "",
    image: "",
    color: "",
    chassisNumber: "",
    engineNumber: "",
    status: "",
    manufactureDate: "",
    modelId: "m3",
    customerId: "",
    customer: {
      id: "",
      firstName: "",
      lastName: "",
      address: "",
      citizenId: "",
      dateOfBirth: "",
      gender: "",
      avatarUrl: "",
      accountId: "",
    },
  },
];

/* --- form state types & init --- */
type RepairFormState = {
  serviceCenterId?: string;
  customerId?: string;
  vehicleId?: string;
  appointmentDate?: string;
  slotTime?: string;
  type?: string;
  description?: string;
};

const initState: RepairFormState = {
  serviceCenterId: "",
  customerId: "",
  vehicleId: vehicles[0]?.id ?? "",
  appointmentDate: "",
  slotTime: "",
  type: "REPAIR_TYPE",
  description: "",
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

  // stack of snapshots for "Quay lại"
  const [prevStack, setPrevStack] = useState<RepairFormState[]>([]);

  const auth = useSelector(authSelecter);

  const [accountId, setAccountId] = useState(auth.accountResponse?.id || "");
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomer();
  }, [accountId]);

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
    const result = await CreateAppointment(state);
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
        <ButtonComponent
          text="Đặt lịch"
          type="primary"
          onPress={handleSubmit}
        />
      );
    }

    if (step === 1) {
      return (
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
      );
    }

    // default for step 0,2,3
    return (
      <ButtonComponent
        text="Tiếp tục"
        type="primary"
        onPress={handleNextStep}
      />
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
          <ChooseVehicle
            vehicles={vehicles}
            onSelect={handleSelectVehicle}
            initialSelectedId={vehicleSelectId}
            errorMessage={errorMessage}
          />

          <SectionComponent>
            <TextComponent
              text="Mô tả tình trạng hiện tại"
              size={16}
              font={fontFamilies.roboto_regular}
              color={appColor.text}
            />
            <SpaceComponent height={12} />
            <InputComponent
              allowClear
              value={state.description ?? ""}
              onChange={(payload: any) => {
                const value =
                  typeof payload === "string"
                    ? payload
                    : payload?.nativeEvent?.text ?? payload?.text ?? "";
                dispatch({ type: "SET", payload: { description: value } });
              }}
              placeholder="Nhập trình trạng xe"
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
});

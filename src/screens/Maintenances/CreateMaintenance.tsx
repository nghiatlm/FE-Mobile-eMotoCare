import { AntDesign } from "@expo/vector-icons";
import { BrifecaseTimer, CalendarTick } from "iconsax-react-nativejs";
import React, { useEffect, useReducer, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { authSelecter } from "../../redux/reducers/authReducer";
import { CreateAppointment } from "../../services/appointment.service";
import { getCustomerByAccount } from "../../services/customer.service";
import { getVehicleStage } from "../../services/vehicle.service";
import ConfirmStep from "./components/ConfirmStep";
import SelectCenterStep from "./components/SelectCenterStep";
import SelectTimeStep from "./components/SelectTimeStep";

type State = {
  serviceCenterId?: string;
  customerId?: string;
  vehicleStageId?: string;
  slotTime?: string;
  appointmentDate?: string;
  type?: string;
};

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const CreateMaintenance = ({ navigation, route }: any) => {
  const { stage } = route.params;

  const auth = useSelector(authSelecter);

  const [accountId, setAccountId] = useState(auth.accountResponse?.id || "");
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    setAccountId(auth.accountResponse?.id || "");
  }, [auth.accountResponse]);

  useEffect(() => {
    fetchCustomer();
  }, [accountId]);

  useEffect(() => {
    fetchVechicleStages();
  }, [stage]);

  const initialState: State = {
    serviceCenterId: "",
    customerId: "",
    vehicleStageId: stage,
    appointmentDate: "",
    slotTime: "",
    type: "MAINTENANCE_TYPE",
  };
  const [step, setStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [serviceCenter, setServiceCenter] = useState();
  const [vehicle, setVehicle] = useState();

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    // Chỉ build payload gồm các trường cần thiết
    const payload = {
      serviceCenterId: state.serviceCenterId,
      customerId: state.customerId,
      vehicleStageId: state.vehicleStageId,
      slotTime: state.slotTime,
      appointmentDate: state.appointmentDate,
      type: state.type,
    };

    console.log("Submit payload:", payload);

    const result = await CreateAppointment(payload);
    console.log("Create appointment result:", result.message);
    if (result.success) {
      console.log("Success: ", result.data);
      navigation.navigate("WaitConfirm", { id: result.data.id });
    } else {
      console.log("Failed: ", result.message);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const fetchVechicleStages = async () => {
    const res = await getVehicleStage(stage);
    if (res.success) {
      console.log("Vehicle stage data:", res.data);
      setVehicle(res.data?.vehicle);
    } else {
      console.log("Failed to fetch vehicle stage:", res.message);
    }
  };

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

  const canNext = React.useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return !!(state.appointmentDate && state.slotTime);
    return true;
  }, [step, state.appointmentDate, state.slotTime]);

  const footer = (
    <View style={{ paddingHorizontal: 2, width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginVertical: -2,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          {step > 0 ? (
            <ButtonComponent
              text="Quay lại"
              onPress={handleBack}
              styles={[{ marginBottom: -10 }]}
            />
          ) : (
            <View
              style={{ height: 48 /* giữ khoảng trống tương ứng button */ }}
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <ButtonComponent
            text={step === 2 ? "Xác nhận" : "Tiếp theo"}
            type="primary"
            onPress={handleNext}
            disabled={!canNext}
            styles={[{ marginBottom: -10 }]}
          />
        </View>
      </View>
    </View>
  );

  return (
    <BackgroundComponent
      back
      title="Đặt lịch bảo dưỡng"
      isScroll
      footer={step === 0 ? undefined : footer} // vẫn ẩn footer ở step 0
    >
      <SpaceComponent height={12} />
      <View style={{ paddingHorizontal: 8 }}>
        <RowComponent justify="space-between">
          {/* --- Step 1 --- */}
          {(() => {
            const done0 = step >= 0;
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done0 ? appColor.primary : appColor.white,
                      borderWidth: 1.5,
                      borderColor: done0 ? appColor.primary : appColor.gray,
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                    },
                    done0
                      ? {
                          elevation: 3,
                          shadowColor: appColor.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.18,
                          shadowRadius: 4,
                        }
                      : {},
                  ]}
                >
                  <BrifecaseTimer
                    size={20}
                    color={done0 ? appColor.white : appColor.gray}
                    variant="Outline"
                  />
                </View>
                <SpaceComponent height={6} />
                <TextComponent
                  text="Trung tâm"
                  font={fontFamilies.roboto_regular}
                  size={14}
                  color={done0 ? appColor.primary : appColor.text}
                />
              </View>
            );
          })()}

          {/* --- Step 2 --- */}
          {(() => {
            const done1 = step >= 1;
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done1 ? appColor.primary : appColor.white,
                      borderWidth: 1.5,
                      borderColor: done1 ? appColor.primary : appColor.gray,
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                    },
                    done1
                      ? {
                          elevation: 3,
                          shadowColor: appColor.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.18,
                          shadowRadius: 4,
                        }
                      : {},
                  ]}
                >
                  <CalendarTick
                    size="22"
                    color={done1 ? appColor.white : appColor.gray}
                    variant="Outline"
                  />
                </View>
                <SpaceComponent height={6} />
                <TextComponent
                  text="Thời gian"
                  font={fontFamilies.roboto_regular}
                  size={14}
                  color={done1 ? appColor.primary : appColor.text}
                />
              </View>
            );
          })()}

          {/* --- Step 3 --- */}
          {(() => {
            const done2 = step >= 2;
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done2 ? appColor.primary : appColor.white,
                      borderWidth: 1.5,
                      borderColor: done2 ? appColor.primary : appColor.gray,
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                    },
                    done2
                      ? {
                          elevation: 3,
                          shadowColor: appColor.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.18,
                          shadowRadius: 4,
                        }
                      : {},
                  ]}
                >
                  <AntDesign
                    name="check-circle"
                    size={22}
                    color={done2 ? appColor.white : appColor.gray}
                  />
                </View>
                <SpaceComponent height={6} />
                <TextComponent
                  text="Xác nhận"
                  font={fontFamilies.roboto_regular}
                  size={14}
                  color={done2 ? appColor.primary : appColor.text}
                />
              </View>
            );
          })()}
        </RowComponent>

        {step === 0 && (
          <SelectCenterStep
            state={state}
            onSelectCenter={(center: any) => {
              console.log("Trung tâm được chọn:", center);
              setServiceCenter(center);
              // set service center id in reducer (SelectCenterStep already dispatches but keep in sync)
              dispatch({
                type: "SET",
                payload: {
                  serviceCenterId: center.id,
                  appointmentDate: "",
                  timeSlot: "",
                  serviceCenterSlotId: "",
                },
              });
              // chuyển ngay sang bước chọn thời gian
              setStep(1);
            }}
            dispatch={dispatch}
          />
        )}
        {step === 1 && (
          <SelectTimeStep
            state={state}
            dispatch={dispatch}
            center={serviceCenter}
          />
        )}
        {step === 2 && (
          <ConfirmStep
            state={state}
            dispatch={dispatch}
            center={serviceCenter}
            vehicle={vehicle}
          />
        )}
      </View>
    </BackgroundComponent>
  );
};

export default CreateMaintenance;

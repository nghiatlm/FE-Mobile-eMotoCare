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
  timeSlot?: string;
  appointmentDate?: string;
  serviceCenterSlotId?: string;
  slot?: string;
  notes?: string;
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
    timeSlot: "",
    serviceCenterSlotId: "",
    type: "MAINTENANCE_TYPE",
  };
  const [step, setStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [serviceCenter, setServiceCenter] = useState();
  const [vehicle, setVehicle] = useState();

  const handleNext = async () => {
    if (step < 2) setStep(step + 1);
    else {
      console.log("Submit:", state);
      const result = await CreateAppointment(state);
      if (result.success) {
        console.log("Success: ", result.data);
        navigation.navigate("WaitConfirm", {
          id: "121234",
        });
      } else {
        console.log("Failed: ", result.message);
      }
      navigation.navigate("SuccessScreen", {
        id: "871a5113-599b-4047-80e4-23e0259a7447",
      });
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
    if (step === 1) return !!(state.appointmentDate && state.timeSlot);
    return true; 
  }, [step, state.appointmentDate, state.timeSlot]);

  const footer = (
    <View style={{ paddingHorizontal: 8, width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginVertical: 6,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          {step > 0 ? (
            <ButtonComponent text="Quay lại" onPress={handleBack} />
          ) : (
            <View style={{ height: 48 /* giữ khoảng trống tương ứng button */ }} />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <ButtonComponent
            text={step === 2 ? "Xác nhận" : "Tiếp theo"}
            type="primary"
            onPress={handleNext}
            disabled={!canNext} 
          />
        </View>
      </View>

      {!canNext && step === 1 && (
        <TextComponent
          text="Vui lòng chọn ngày và khung giờ để tiếp tục"
          color={appColor.gray2}
          size={12}
          styles={{ marginTop: 8 }}
        />
      )}
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
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: done0 ? appColor.primary : appColor.white,
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

          {/* --- Step 2 --- */}
          {(() => {
            const done1 = step >= 1;
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: done1 ? appColor.primary : appColor.white,
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

          {/* --- Step 3 --- */}
          {(() => {
            const done2 = step >= 2;
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: done2 ? appColor.primary : appColor.white,
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

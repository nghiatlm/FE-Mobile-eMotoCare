import { AntDesign } from "@expo/vector-icons";
import { BrifecaseTimer, CalendarTick } from "iconsax-react-nativejs";
import React, { useReducer, useState } from "react";
import { View } from "react-native";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import ConfirmStep from "./components/ConfirmStep";
import SelectCenterStep from "./components/SelectCenterStep";
import SelectTimeStep from "./components/SelectTimeStep";
import { CreateAppointment } from "../../services/appointment.service";

type State = {
  serviceCenterId?: string;
  customerId?: string;
  vehicleStageId?: string;
  timeSlot?: string;
  appointmentDate?: string;
  slot?: string;
  notes?: string;
  type?: string;
};

const initialState: State = {
  serviceCenterId: "",
  customerId: "7e639b73-cd8a-4459-8a49-58234f4e5fc1",
  vehicleStageId: "1bfc9f3c-e394-4240-9f3b-8f1dc5d5cf73",
  appointmentDate: "",
  timeSlot: "",
  type: "MAINTENACE_TYPE",
};

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const CreateMaintenance = ({ navigation }: any) => {
  const [step, setStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [serviceCenter, setServiceCenter] = useState();

  const handleNext = async () => {
    if (step < 2) setStep(step + 1);
    else {
      // console.log("Submit:", state);
      // const result = await CreateAppointment(state);
      // if (result.success) {
      //   console.log("Success: ", result.data);
      // } else {
      //   console.log("Failed: ", result.message);
      // }
      navigation.navigate("SuccessScreen", {
        // id: result.data.id,
        id: "121234",
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const footer = (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {step > 0 ? (
          <ButtonComponent text="Quay lại" onPress={handleBack} />
        ) : (
          <View style={{ width: 120 }} />
        )}
        <ButtonComponent
          text={step === 2 ? "Xác nhận" : "Tiếp theo"}
          type="primary"
          onPress={handleNext}
        />
      </View>
    </View>
  );

  return (
    <BackgroundComponent
      back
      title="Đặt lịch bảo dưỡng"
      isScroll
      footer={footer}
    >
      <SpaceComponent height={12} />
      <View style={{ paddingHorizontal: 8 }}>
        <RowComponent justify="space-between">
          {/* --- Step 1 --- */}
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: step === 0 ? appColor.primary : appColor.white,
                borderWidth: 1.5,
                borderColor: appColor.gray,
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            >
              <BrifecaseTimer
                size={24}
                color={step === 0 ? appColor.white : appColor.gray}
                variant="Outline"
              />
            </View>
            <SpaceComponent height={4} />
            <TextComponent
              text="Trung tâm"
              font={fontFamilies.roboto_regular}
              size={16}
              color={step === 0 ? appColor.primary : appColor.text}
            />
          </View>

          {/* --- Step 2 --- */}
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: step === 1 ? appColor.primary : appColor.white,
                borderWidth: 1.5,
                borderColor: appColor.gray,
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            >
              <CalendarTick
                size="28"
                color={step === 1 ? appColor.white : appColor.gray}
                variant="Outline"
              />
            </View>
            <SpaceComponent height={4} />
            <TextComponent
              text="Thời gian"
              font={fontFamilies.roboto_regular}
              size={16}
              color={step === 1 ? appColor.primary : appColor.text}
            />
          </View>

          {/* --- Step 3 --- */}
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: step === 2 ? appColor.primary : appColor.white,
                borderWidth: 1.5,
                borderColor: appColor.gray,
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            >
              <AntDesign
                name="check-circle"
                size={28}
                color={step === 2 ? appColor.white : appColor.gray}
              />
            </View>
            <SpaceComponent height={4} />
            <TextComponent
              text="Xác nhận"
              font={fontFamilies.roboto_regular}
              size={16}
              color={step === 2 ? appColor.primary : appColor.text}
            />
          </View>
        </RowComponent>

        {step === 0 && (
          <SelectCenterStep
            state={state}
            onSelectCenter={(center: any) => {
              console.log("Trung tâm được chọn:", center);
              setServiceCenter(center);
            }}
            dispatch={dispatch}
          />
        )}
        {step === 1 && <SelectTimeStep state={state} dispatch={dispatch} />}
        {step === 2 && (
          <ConfirmStep
            state={state}
            dispatch={dispatch}
            center={serviceCenter}
          />
        )}
      </View>
    </BackgroundComponent>
  );
};

export default CreateMaintenance;

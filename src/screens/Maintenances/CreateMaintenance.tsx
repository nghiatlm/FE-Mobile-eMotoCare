import { View, Text } from "react-native";
import React, { useReducer } from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import {
  BrifecaseTimer,
  CalendarTick,
  InfoCircle,
} from "iconsax-react-nativejs";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { AntDesign } from "@expo/vector-icons";
import SelectCenterStep from "./components/SelectCenterStep";
import SelectTimeStep from "./components/SelectTimeStep";
import VehicleInfoStep from "./components/VehicleInfoStep";
import ConfirmStep from "./components/ConfirmStep";

type State = {
  step: number;
  serviceCenterId?: string;
  customerId?: string;
  vehicleStageId?: string;
  timeSlot?: string;
  appointmentDate?: string;
  slot?: string;
  vehicleId?: string;
  notes?: string;
  type?: string;
};

const initialState: State = { step: 0 };

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload };
    case "NEXT":
      return { ...state, step: Math.min(3, state.step + 1) };
    case "BACK":
      return { ...state, step: Math.max(0, state.step - 1) };
    default:
      return state;
  }
}

const CreateMaintenance = ({ navigation }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const footer = (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {state.step > 0 ? (
          <ButtonComponent
            text="Quay lại"
            type="link"
            onPress={() => dispatch({ type: "BACK" })}
          />
        ) : (
          <View style={{ width: 120 }} />
        )}
        <ButtonComponent
          text={state.step === 3 ? "Xác nhận" : "Tiếp theo"}
          type="primary"
          onPress={() => {
            if (state.step < 3) dispatch({ type: "NEXT" });
            else {
              console.log("submit", state);
              navigation.goBack();
            }
          }}
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
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <BrifecaseTimer
              size="28"
              color={appColor.primary}
              variant="Outline"
            />
            <SpaceComponent height={4} />
            <TextComponent
              text="Trung tâm"
              font={fontFamilies.roboto_regular}
              size={16}
              color={appColor.text}
            />
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <CalendarTick
              size="28"
              color={appColor.primary}
              variant="Outline"
            />
            <SpaceComponent height={4} />
            <TextComponent
              text="Thời gian"
              font={fontFamilies.roboto_regular}
              size={16}
              color={appColor.text}
            />
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <AntDesign name="check-circle" size={28} color={appColor.primary} />
            <SpaceComponent height={4} />
            <TextComponent
              text="Xác nhận"
              font={fontFamilies.roboto_regular}
              size={16}
              color={appColor.text}
            />
          </View>
        </RowComponent>

        {state.step === 0 && (
          <SelectCenterStep state={state} dispatch={dispatch} />
        )}
        {state.step === 1 && (
          <SelectTimeStep state={state} dispatch={dispatch} />
        )}
        {state.step === 2 && <ConfirmStep state={state} dispatch={dispatch} />}
      </View>
    </BackgroundComponent>
  );
};

export default CreateMaintenance;

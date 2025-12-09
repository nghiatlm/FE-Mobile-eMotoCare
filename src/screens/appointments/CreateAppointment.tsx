import React, { useEffect, useState } from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { View } from "react-native";
import { appColor } from "../../constants/appColor";
import { BrifecaseTimer, CalendarTick } from "iconsax-react-nativejs";
import { fontFamilies } from "../../constants/fontFamilies";
import { AntDesign } from "@expo/vector-icons";
import SelectCenterStep from "./components/SelectCenterStep";
import { Appointment } from "../../types/appointment.type";
import SelectTimeSlotStep from "./components/SelectTimeSlotStep";
import ConfirmStep from "./components/ConfirmStep";
import { getVehicleById } from "../../services/vehicle.service";
import { createAppointment } from "../../services/appointment.service";
import { useSelector } from "react-redux";
import { authSelecter } from "../../redux/reducers/authReducer";
import { getByAccount } from "../../services/customer.service";

const CreateAppointment = ({ route, navigation }: any) => {
  const { type, vehicleStageId, vehicleId } = route?.params || {};

  const [vehicle, setVehicle] = useState<any>(null);
  const auth = useSelector(authSelecter);
  const [customer, setCustomer] = useState<any>(null);
  const [accountId, setAccountId] = useState(auth.accountResponse?.id || "");

  const [appointmentRequest, setAppointmentRequest] = useState<Appointment>(
    new Appointment()
  );

  const [step, setStep] = useState(0);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    fetchVehicle(vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    fetchCustomer();
  }, [accountId]);

  useEffect(() => {
    setAppointmentRequest((prev) => ({
      ...prev,
      type: type || prev.type,
      vehicleStageId: vehicleStageId || prev.vehicleStageId,
      vehicleId: vehicleId || prev.vehicleId,
      customerId: customer?.id || prev.customerId,
    }));
  }, [type, vehicleStageId, vehicleId, customer]);

  const handleSelectCenter = (center: any) => {
    const updatedRequest = {
      ...appointmentRequest,
      serviceCenterId: center.id,
    };
    setAppointmentRequest(updatedRequest);
    setSelectedCenter(center);
    setStep(1);
    console.log("request", updatedRequest);
  };

  const fetchCustomer = async () => {
    if (!accountId) return;
    const res = await getByAccount(accountId);
    if (res.success) {
      console.log("Customer data:", res.data);
      setCustomer(res.data);
    } else {
      console.log("Failed to fetch customer:", res.message);
    }
  };

  const handleSelectTimeSlot = (slot: { date: string; time: string }) => {
    const updatedRequest = {
      ...appointmentRequest,
      appointmentDate: slot.date,
      slotTime: slot.time,
    };

    setSelectedSlot(slot);
    setAppointmentRequest(updatedRequest);
    setStep(2);

    console.log("Thời gian đã chọn:", slot);
    console.log("Appointment request:", updatedRequest);
  };

  const fetchVehicle = async (id: string) => {
    const res = await getVehicleById(id);
    if (res.success) {
      setVehicle(res.data);
    } else {
      setVehicle(null);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    const res = await createAppointment(appointmentRequest);
    if (res.success) {
      console.log("Appointment created successfully:", res);
      navigation.navigate("WaitConfirm", { id: res.data.id });
    } else {
      console.log("Failed to create appointment:", res.message);
    }
    console.log("Final appointment request:", appointmentRequest);
  };

  const footerComponent = (
    <SectionComponent styles={{ marginHorizontal: 8 }}>
      <RowComponent styles={{ gap: 12 }}>
        {step > 0 && (
          <ButtonComponent
            text="Quay lại"
            type="secondary"
            onPress={handleBack}
            styles={{ width: "90%" }}
          />
        )}

        {step > 0 && (
          <ButtonComponent
            text={step === 2 ? "Xác nhận" : "Tiếp theo"}
            type="primary"
            onPress={handleNext}
            styles={{ width: step > 0 ? "90%" : "100%" }}
          />
        )}
      </RowComponent>
    </SectionComponent>
  );

  return (
    <BackgroundComponent
      back
      title={
        type === "MAINTENANCE_TYPE"
          ? "Đặt lịch bảo dưỡng"
          : type === "CHECKUP"
          ? "Đặt lịch kiểm tra"
          : "Đặt lịch sửa chữa"
      }
      isScroll
      footer={footerComponent}
    >
      <SpaceComponent height={12} />
      <View style={{ paddingHorizontal: 8 }}>
        <RowComponent justify="space-between">
          {(() => {
            const done0 = step >= 0;
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done0
                        ? appColor.primary
                        : appColor.white,
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
                      backgroundColor: done1
                        ? appColor.primary
                        : appColor.white,
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
                      backgroundColor: done2
                        ? appColor.primary
                        : appColor.white,
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

        {step === 0 && <SelectCenterStep onSelectCenter={handleSelectCenter} />}
        {step === 1 && (
          <SelectTimeSlotStep
            centerId={selectedCenter?.id}
            onSelectTimeSlot={handleSelectTimeSlot}
          />
        )}
        {step === 2 && (
          <ConfirmStep
            center={selectedCenter}
            vehicle={vehicle}
            timeSlot={selectedSlot}
            appointmentRequest={appointmentRequest}
          />
        )}
      </View>
    </BackgroundComponent>
  );
};

export default CreateAppointment;

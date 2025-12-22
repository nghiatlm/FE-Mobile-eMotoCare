import React, { useEffect, useState } from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { View, ActivityIndicator } from "react-native";
import { appColor } from "../../constants/appColor";
import { BrifecaseTimer, CalendarTick } from "iconsax-react-nativejs";
import { fontFamilies } from "../../constants/fontFamilies";
import { AntDesign } from "@expo/vector-icons";
import SelectCenterStep from "./components/SelectCenterStep";
import { Appointment } from "../../types/appointment.type";
import SelectTimeSlotStep from "./components/SelectTimeSlotStep";
import ConfirmStep from "./components/ConfirmStep";
import { getVehicleById, getVehicles } from "../../services/vehicle.service";
import { createAppointment } from "../../services/appointment.service";
import { useSelector } from "react-redux";
import { authSelecter } from "../../redux/reducers/authReducer";
import { getByAccount } from "../../services/customer.service";
import { getCurrentLocation, LocationCoords } from "../../utils/location.util";
import ChooseVehicle from "../repair/components/ChooseVehicle";
import { Car } from "iconsax-react-nativejs";

const CreateAppointment = ({ route, navigation }: any) => {
  const { type, vehicleStageId, vehicleId } = route?.params || {};

  const [vehicle, setVehicle] = useState<any>(null);
  const auth = useSelector(authSelecter);
  const [customer, setCustomer] = useState<any>(null);
  const [customerLoaded, setCustomerLoaded] = useState<boolean>(false);
  const [accountId, setAccountId] = useState(auth.accountResponse?.id || "");

  const [appointmentRequest, setAppointmentRequest] = useState<Appointment>(
    new Appointment()
  );

  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [note, setNote] = useState<string>("");
  const [step, setStep] = useState(0);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchVehicle(vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    fetchCustomer();
  }, [accountId]);

  useEffect(() => {
    loadLocation();
  }, []);

  // Ensure we show loading first when entering REPAIR flow
  useEffect(() => {
    if (type === "REPAIR_TYPE") {
      setVehiclesLoading(true);
    }
  }, [type]);

  useEffect(() => {
    if (type === "REPAIR_TYPE") {
      if (customer?.id) {
        console.log("Fetching vehicles for customer:", customer.id);
        fetchVehicles();
      } else if (customerLoaded) {
        // Customer load finished but no id -> end loading and show empty state
        setVehicles([]);
        setVehiclesLoading(false);
      }
    }
  }, [customer?.id, type, customerLoaded]);

  useEffect(() => {
    setAppointmentRequest((prev) => ({
      ...prev,
      type: type || prev.type,
      vehicleStageId: vehicleStageId || prev.vehicleStageId,
      vehicleId: vehicleId || prev.vehicleId,
      customerId: customer?.id || prev.customerId,
    }));
  }, [type, vehicleStageId, vehicleId, customer]);

  const handleSelectVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setVehicle(vehicle);
    const updatedRequest = {
      ...appointmentRequest,
      vehicleId: vehicle.id,
    };
    setAppointmentRequest(updatedRequest);
  };

  const handleSelectCenter = (center: any) => {
    const updatedRequest = {
      ...appointmentRequest,
      serviceCenterId: center.id,
    };
    setAppointmentRequest(updatedRequest);
    setSelectedCenter(center);
    setStep(type === "REPAIR_TYPE" ? 2 : 1);
    console.log("request", updatedRequest);
  };

  const fetchCustomer = async () => {
    if (!accountId) {
      setCustomer(null);
      setCustomerLoaded(true);
      return;
    }
    const res = await getByAccount(accountId);
    if (res.success) {
      setCustomer(res.data);
    } else {
      console.log("Failed to fetch customer:", res.message);
      setCustomer(null);
    }
    setCustomerLoaded(true);
  };

  const handleSelectTimeSlot = (slot: { date: string; time: string }) => {
    const updatedRequest = {
      ...appointmentRequest,
      appointmentDate: slot.date,
      slotTime: slot.time,
    };

    setSelectedSlot(slot);
    setAppointmentRequest(updatedRequest);

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

  const fetchVehicles = async () => {
    if (!customer?.id) return;
    setVehiclesLoading(true);
    try {
      const res = await getVehicles({ customerId: customer.id });
      if (res.success) {
        const vehicleList = res.data?.rowDatas || [];
        setVehicles(vehicleList);
        if (vehicleList.length > 0) {
          setSelectedVehicle(vehicleList[0]);
          setVehicle(vehicleList[0]);
        }
      } else {
        console.log("Failed to fetch vehicles:", res.message);
        setVehicles([]);
      }
    } finally {
      setVehiclesLoading(false);
    }
  };

  const loadLocation = async () => {
    try {
      setLocationLoading(true);
      const { coords, error } = await getCurrentLocation();
      if (coords) {
        setUserLocation(coords);
      }
      setLocationError(error || null);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleNext = async () => {
    if (step === 0 && type === "REPAIR_TYPE") {
      if (!selectedVehicle) {
        setValidationError("Vui lòng chọn xe");
        return;
      }
      if (!note.trim()) {
        setValidationError("Vui lòng nhập tình trạng hiện tại của xe");
        return;
      }
      const updatedRequest = {
        ...appointmentRequest,
        vehicleId: selectedVehicle.id,
        note: note,
      };
      setAppointmentRequest(updatedRequest);
      setValidationError(null);
      setStep(1);
      return;
    }

    const timeStepIndex = type === "REPAIR_TYPE" ? 2 : 1;
    if (step === timeStepIndex) {
      if (!selectedSlot?.date) {
        setValidationError("Vui lòng chọn ngày");
        return;
      }
      if (!selectedSlot?.time) {
        setValidationError("Vui lòng chọn khung giờ");
        return;
      }
      setValidationError(null);
    }

    const finalStepIndex = type === "REPAIR_TYPE" ? 3 : 2;
    if (step < finalStepIndex) {
      setStep(step + 1);
      return;
    }

    setIsCreating(true);
    try {
      const res = await createAppointment(appointmentRequest);
      if (res.success) {
        console.log("Appointment created successfully:", res);
        navigation.navigate("WaitConfirm", { id: res.data.id });
      } else {
        console.log("Failed to create appointment:", res.message);
        alert("Tạo lịch không thành công. Vui lòng thử lại.");
      }
      console.log("Final appointment request:", appointmentRequest);
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsCreating(false);
    }
  };

  const footerComponent = (
    <View>
      <RowComponent styles={{ 
        gap: step > 0 ? 12 : 0, 
        paddingHorizontal: step > 0 ? 12 : 0 
      }}>
        {step > 0 && (
          <ButtonComponent
            text="Quay lại"
            type="secondary"
            onPress={handleBack}
            styles={{ width: "100%" }}
            disabled={isCreating}
          />
        )}

        <ButtonComponent
          text={
            isCreating
              ? ""
              : step === (type === "REPAIR_TYPE" ? 3 : 2)
              ? "Xác nhận"
              : "Tiếp theo"
          }
          type="primary"
          onPress={handleNext}
          styles={{ width: "100%" }}
          disabled={isCreating}
          icon={
            isCreating ? (
              <ActivityIndicator size="small" color={appColor.white} />
            ) : undefined
          }
        />
      </RowComponent>
    </View>
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
      <SpaceComponent height={16} />
      <View style={{ marginHorizontal: -4, flex: 1 }}>
        <RowComponent justify="space-between" styles={{ marginBottom: 20 }}>
          {type === "REPAIR_TYPE" &&
            (() => {
              const done0 = step >= 0;
              return (
                <View style={{ alignItems: "center", flex: 1 }}>
                  <View
                    style={[
                      {
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: done0
                          ? appColor.primary
                          : appColor.white,
                        borderWidth: 2,
                        borderColor: done0 ? appColor.primary : appColor.gray,
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                      },
                      done0
                        ? {
                            elevation: 4,
                            shadowColor: appColor.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 6,
                          }
                        : {},
                    ]}
                  >
                    <Car
                      size={22}
                      color={done0 ? appColor.white : appColor.gray}
                      variant="Outline"
                    />
                  </View>
                  <SpaceComponent height={8} />
                  <TextComponent
                    text="Chọn xe"
                    font={fontFamilies.roboto_medium}
                    size={13}
                    color={done0 ? appColor.primary : appColor.text}
                  />
                </View>
              );
            })()}
          {/* --- Step Trung tâm --- */}
          {(() => {
            const done0 = type === "REPAIR_TYPE" ? step >= 1 : step >= 0;
            return (
              <View style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done0
                        ? appColor.primary
                        : appColor.white,
                      borderWidth: 2,
                      borderColor: done0 ? appColor.primary : appColor.gray,
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                    },
                    done0
                      ? {
                          elevation: 4,
                          shadowColor: appColor.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 6,
                        }
                      : {},
                  ]}
                >
                  <BrifecaseTimer
                    size={22}
                    color={done0 ? appColor.white : appColor.gray}
                    variant="Outline"
                  />
                </View>
                <SpaceComponent height={8} />
                <TextComponent
                  text="Trung tâm"
                  font={fontFamilies.roboto_medium}
                  size={13}
                  color={done0 ? appColor.primary : appColor.text}
                />
              </View>
            );
          })()}
          {/* --- Step Thời gian --- */}
          {(() => {
            const done1 = type === "REPAIR_TYPE" ? step >= 2 : step >= 1;
            return (
              <View style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done1
                        ? appColor.primary
                        : appColor.white,
                      borderWidth: 2,
                      borderColor: done1 ? appColor.primary : appColor.gray,
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                    },
                    done1
                      ? {
                          elevation: 4,
                          shadowColor: appColor.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 6,
                        }
                      : {},
                  ]}
                >
                  <CalendarTick
                    size="24"
                    color={done1 ? appColor.white : appColor.gray}
                    variant="Outline"
                  />
                </View>
                <SpaceComponent height={8} />
                <TextComponent
                  text="Thời gian"
                  font={fontFamilies.roboto_medium}
                  size={13}
                  color={done1 ? appColor.primary : appColor.text}
                />
              </View>
            );
          })()}
          {/* --- Step Xác nhận --- */}
          {(() => {
            const done2 = type === "REPAIR_TYPE" ? step >= 3 : step >= 2;
            return (
              <View style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done2
                        ? appColor.primary
                        : appColor.white,
                      borderWidth: 2,
                      borderColor: done2 ? appColor.primary : appColor.gray,
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                    },
                    done2
                      ? {
                          elevation: 4,
                          shadowColor: appColor.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 6,
                        }
                      : {},
                  ]}
                >
                  <AntDesign
                    name="check-circle"
                    size={24}
                    color={done2 ? appColor.white : appColor.gray}
                  />
                </View>
                <SpaceComponent height={8} />
                <TextComponent
                  text="Xác nhận"
                  font={fontFamilies.roboto_medium}
                  size={13}
                  color={done2 ? appColor.primary : appColor.text}
                />
              </View>
            );
          })()}
        </RowComponent>

        {step === 0 && type === "REPAIR_TYPE" && (
          <>
            {vehiclesLoading ? (
              <SectionComponent
                styles={{ alignItems: "center", paddingVertical: 40 }}
              >
                <ActivityIndicator size="large" color={appColor.primary} />
                <SpaceComponent height={12} />
                <TextComponent
                  text="Đang tải danh sách xe..."
                  size={14}
                  color={appColor.gray2}
                />
              </SectionComponent>
            ) : vehicles.length > 0 ? (
              <>
                <ChooseVehicle
                  vehicles={vehicles}
                  initialSelectedId={selectedVehicle?.id}
                  onSelect={handleSelectVehicle}
                  errorMessage={validationError || undefined}
                />
                <SpaceComponent height={16} />
                <SectionComponent>
                  <TextComponent
                    text="Tình trạng hiện tại của xe"
                    font={fontFamilies.roboto_medium}
                  />
                  <SpaceComponent height={8} />
                  <InputComponent
                    placeholder="Mô tả tình trạng xe (vd: bị xước, lỗi phanh...)"
                    value={note}
                    onChange={setNote}
                    error={
                      validationError && note.trim() === ""
                        ? validationError
                        : undefined
                    }
                  />
                </SectionComponent>
              </>
            ) : (
              <SectionComponent
                styles={{ alignItems: "center", paddingVertical: 40 }}
              >
                <TextComponent
                  text="Không có xe nào"
                  size={14}
                  color={appColor.gray2}
                />
              </SectionComponent>
            )}
          </>
        )}
        {step === (type === "REPAIR_TYPE" ? 1 : 0) && (
          <SelectCenterStep
            onSelectCenter={handleSelectCenter}
            userLocation={userLocation}
            locationLoading={locationLoading}
            locationError={locationError}
            onRetryLocation={loadLocation}
          />
        )}
        {step === (type === "REPAIR_TYPE" ? 2 : 1) && (
          <SelectTimeSlotStep
            centerId={selectedCenter?.id}
            onSelectTimeSlot={handleSelectTimeSlot}
            validationError={validationError}
          />
        )}
        {step === (type === "REPAIR_TYPE" ? 3 : 2) && (
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

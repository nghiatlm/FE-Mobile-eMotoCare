import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useAppointmentHub from "../../hooks/useAppointmentHub.hook";
import useEvcheckHub from "../../hooks/useEVCheckHub";
import { getAppointmentById } from "../../services/appointment.service";
import {
  BackgroundComponent,
  ButtonComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";
import { getEvcheckDetail } from "../../services/evcheck.service";
import { statusActivities } from "../../utils/generateStatus";
import { AntDesign } from "@expo/vector-icons";
import { Location } from "iconsax-react-nativejs";

const mapStatusToStep = (status?: string) => {
  const s = (status || "").toUpperCase();
  if (s.includes("PENDING")) return 1;
  if (s.includes("APPROVED") || s.includes("CONFIRMED")) return 2;
  if (s.includes("CHECKED_IN") || s.includes("VEHICLE_INSPECTION")) return 3;
  if (s.includes("INSPECTION_COMPLETED") || s.includes("QUOTE_APPROVED"))
    return 4;
  if (s.includes("CANCEL")) return 5;
  if (s.includes("REPAIR_IN_PROGRESS")) return 5;
  if (s.includes("REPAIR_COMPLETED")) return 6;
  if (s.includes("COMPLETE") || s.includes("COMPLETED") || s.includes("DONE"))
    return 7;
  return 1;
};

const RepairProcess = ({ navigation, route }: any) => {
  const id = route?.params?.id;
  const type = route?.params?.type;
  // optional params passed when navigating back from InspectionResult
  const initialEvcheckParam =
    route?.params?.evcheck || route?.params?.evcheckId;
  const initialForceStep = route?.params?.forceStep;
  const initialEvcheckStatus = route?.params?.evcheckStatus;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [evcheckIdState, setEvcheckIdState] = useState<string | null>(null);
  const [rtLogs, setRtLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);

  const addRtLog = (label: string, payload: any) => {
    const line = `${new Date().toLocaleTimeString()} | ${label} | ${
      typeof payload === "object" ? JSON.stringify(payload) : String(payload)
    }`;
    logsRef.current = [line, ...logsRef.current].slice(0, 50);
    setRtLogs([...logsRef.current]);
    console.log(line);
  };

  const { status: apptStatus, description: apptDescription } =
    useAppointmentHub(id);
  const { status: evcheckStatus, description: evcheckDescription } =
    useEvcheckHub(evcheckIdState || "");
  const fetchAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      const res = await getAppointmentById(appointmentId);
      if (res.success) {
        setData(res.data);
        // if appointment contains evCheck id, keep it for evcheck hook
        const foundEvcheckId = res.data?.evCheckId;
        console.log('✅ Fetched appointment, evCheckId:', foundEvcheckId);
        if (foundEvcheckId) setEvcheckIdState(String(foundEvcheckId));
      } else {
        addRtLog("fetchAppointmentError", res.message);
      }
    } catch (err) {
      addRtLog("fetchAppointmentException", String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchEvCheck = async (evCheckIdParam: string) => {
    try {
      setLoading(true);
      const res = await getEvcheckDetail(evCheckIdParam);
      if (res.success) {
        setData((prev: any) => ({ ...prev, evCheck: res.data }));
      } else {
        addRtLog("fetchEvCheckError", res.message);
      }
    } catch (err) {
      addRtLog("fetchEvCheckException", String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    // if we were navigated here with an evcheck id (from InspectionResult), set it immediately
    if (initialEvcheckParam) {
      setEvcheckIdState(String(initialEvcheckParam));
    }
    // if forceStep provided (e.g. after approving evcheck), set current step right away
    if (initialForceStep) {
      setCurrentStep(Number(initialForceStep));
    }
    fetchAppointment(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (evcheckIdState) fetchEvCheck(evcheckIdState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evcheckIdState]);

  // derive effective statuses (prefer realtime values)
  const effectiveApptStatus = (apptStatus || data?.status || "").toUpperCase();
  const effectiveEvcheckStatus = (
    evcheckStatus ||
    data?.evCheck?.status ||
    ""
  ).toUpperCase();

  console.log('🔍 RepairProcess Debug:', {
    evcheckIdState,
    evcheckStatus,
    dataEvCheckStatus: data?.evCheck?.status,
    effectiveEvcheckStatus,
    effectiveApptStatus,
    currentStep
  });

  const isCancelled = effectiveEvcheckStatus.includes("CANCEL");

  // set currentStep based on evcheck status if present, otherwise appointment status
  useEffect(() => {
    const sourceStatus =
      effectiveEvcheckStatus && effectiveEvcheckStatus !== ""
        ? effectiveEvcheckStatus
        : effectiveApptStatus;
    if (sourceStatus) {
      const newStep = mapStatusToStep(sourceStatus);
      console.log('📍 Setting step:', { sourceStatus, currentStep, newStep });
      setCurrentStep(newStep);
    }
  }, [effectiveApptStatus, effectiveEvcheckStatus]);

  const steps = [
    {
      id: 1,
      title: "Đang xử lý yêu cầu",
      desc: "Chúng tôi đang xử lý yêu cầu của bạn và sẽ gửi báo giá sớm.",
    },
    {
      id: 2,
      title: "Đã xác nhận",
    },
    {
      id: 3,
      title: "Check-in & Kiểm tra",
      desc: "Xe của bạn đã được nhận tại trung tâm dịch vụ và đang trong quá trình kiểm tra.",
    },
    {
      id: 4,
      title: "Kết quả kiểm tra",
      desc: "Kỹ thuật viên đã hoàn tất việc kiểm tra và sẽ liên hệ với bạn để thảo luận về các bước tiếp theo.",
    },
    {
      id: 5,
      title: "Sửa chữa",
      desc: isCancelled
        ? "Khách hàng đã hủy sửa chữa sau khi xem kết quả."
        : "Xe của bạn đang được bảo dưỡng và sửa chữa theo yêu cầu.",
    },
    {
      id: 6,
      title: "Thanh toán",
      desc: "Phương tiện của bạn đã sữa chữa xong",
    },
    {
      id: 7,
      title: "Hoàn thành",
    },
  ];

  const filteredSteps = useMemo(() => {
    return steps.filter((s) => {
      if (s.id === 1 && effectiveApptStatus.includes("APPROVED")) return false;
      return true;
    });
  }, [steps, effectiveApptStatus]);

  const getStepIconName = (
    id: number
  ): React.ComponentProps<typeof AntDesign>["name"] => {
    switch (id) {
      case 1:
        return "clock-circle"; 
      case 2:
        return "check-circle"; 
      case 3:
        return "profile"; 
      case 4:
        return "file-text";
      case 5:
        return "tool"; 
      case 6:
        return "credit-card"; 
      case 7:
        return "check-circle"; 
      default:
        return "question-circle";
    }
  };

  return (
    <BackgroundComponent
      back
      title={
        type === "MAINTENANCE_TYPE"
          ? "Quá trình bảo dưỡng"
          : type === "CHECKUP"
          ? "Quán trình kiểm tra kiểm tra"
          : "Quán trình sửa chữa"
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <SpaceComponent height={10} />

        <SpaceComponent height={12} />

        <TextComponent
          text="Chi tiết dịch vụ"
          size={20}
          font={fontFamilies.roboto_bold}
          styles={{ textAlign: "center", color: appColor.text }}
        />
        <TextComponent
          text="Theo dõi những cuộc hẹn bảo dưỡng của bạn"
          size={14}
          color={appColor.gray2}
          styles={{ textAlign: "center", marginTop: 4 }}
        />
        <SpaceComponent height={20} />

        <SectionComponent
          styles={{
            backgroundColor: appColor.white,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: appColor.gray,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <TextComponent
                text="Trung tâm dịch vụ"
                font={fontFamilies.roboto_medium}
                color={appColor.text}
                size={16}
              />
              <TextComponent
                text={data?.serviceCenter?.name}
                size={18}
                color={appColor.primary}
                font={fontFamilies.roboto_bold}
                flex={1}
                styles={{ marginTop: 6 }}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                  alignItems: "center",
                }}
              >
                <View
                  style={[
                    {
                      backgroundColor: statusActivities(data?.status).color,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    },
                  ]}
                >
                  <TextComponent
                    text={statusActivities(data?.status).label}
                    size={12}
                    color={appColor.white}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("InspectionResult", {
                  evcheck: evcheckIdState,
                })
              }
            >
              <TextComponent
                text="Xem vấn đề của xe"
                size={14}
                color={appColor.primary}
                styles={{ textDecorationLine: "underline" }}
              />
            </TouchableOpacity>
          </View>

          <SpaceComponent height={10} />
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign name="calendar" size={16} color={appColor.gray2} style={{ marginRight: 6 }} />
              <TextComponent text="Thời gian" size={14} color={appColor.gray2} />
            </View>
            <TextComponent
              text={`${formatDateDDMMYYYY(
                data?.appointmentDate
              )} ${slotCodeToTimeLabel(data?.slotTime)}`}
              color={appColor.text}
              size={16}
              styles={{ marginTop: 4 }}
            />
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <Location size={16} color={appColor.gray2} style={{ marginRight: 6 }} />
              <TextComponent text="Địa chỉ" size={14} color={appColor.gray2} />
            </View>
            <TextComponent
              text={data?.serviceCenter?.address || ""}
              color={appColor.gray2}
              size={13}
              styles={{ marginTop: 4 }}
            />
          </View>
          <View>
            <TextComponent
              text={`Mã: ${data?.code || "6M78239A23P"}`}
              color={appColor.gray2}
              size={14}
            />
          </View>
        </SectionComponent>

        <SpaceComponent height={25} />
        <View style={styles.timelineContainer}>
          <View
            style={[
              styles.timelineFullLine,
              { backgroundColor: appColor.gray },
            ]}
          />
          {filteredSteps.map((step) => (
            <View key={step.id} style={styles.stepContainer}>
              {(() => {
                const isCancelledStep = isCancelled && step.id === 5;
                return (
                  <View style={styles.timelineColumn}>
                    <View
                      style={[
                        styles.circle,
                        step.id <= currentStep ? styles.circleActive : null,
                        isCancelledStep
                          ? { backgroundColor: appColor.danger }
                          : null,
                      ]}
                    />
                  </View>
                );
              })()}

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {(() => {
                    const isCancelledStep = isCancelled && step.id === 5;
                    const titleColor = isCancelledStep
                      ? appColor.danger
                      : step.id === currentStep
                      ? appColor.primary
                      : appColor.text;

                    return (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AntDesign
                          name={getStepIconName(step.id)}
                          size={18}
                          color={titleColor}
                          style={{ marginRight: 8 }}
                        />
                        <TextComponent
                          text={step.title}
                          color={titleColor}
                          font={
                            step.id === currentStep
                              ? fontFamilies.roboto_bold
                              : fontFamilies.roboto_medium
                          }
                          size={16}
                        />
                      </View>
                    );
                  })()}
                  {step.id === currentStep && (
                    <View style={{ marginLeft: 8 }}>
                      <TextComponent
                        text="Hiện tại"
                        size={12}
                        color={isCancelled ? appColor.danger : appColor.primary}
                      />
                    </View>
                  )}
                </View>
                {step.desc ? (
                  <View>
                    <TextComponent
                      text={step.desc}
                      color={
                        isCancelled && step.id === 5
                          ? appColor.danger
                          : appColor.gray2
                      }
                      size={14}
                      styles={{ marginTop: 4 }}
                    />

                    {step.id === 4 &&
                      effectiveEvcheckStatus.includes(
                        "INSPECTION_COMPLETED"
                      ) && (
                        <View style={{ marginTop: 8, alignSelf: "flex-start" }}>
                          <ButtonComponent
                            text="Xem kết quả kiểm tra"
                            type="text"
                            onPress={() =>
                              navigation.navigate("InspectionResult", {
                                evcheck: evcheckIdState,
                              })
                            }
                            styles={{
                              paddingVertical: 4,
                              paddingHorizontal: 0,
                              backgroundColor: "transparent",
                            }}
                            textColor={appColor.primary}
                          />
                        </View>
                      )}

                    {step.id === 6 &&
                      effectiveEvcheckStatus.includes("REPAIR_COMPLETED") && (
                        <View style={{ marginTop: 8, alignSelf: "flex-start" }}>
                          <ButtonComponent
                            text="Xem hóa đơn thanh toán"
                            type="text"
                            textStyle={{
                              color: appColor.primary,
                            }}
                            onPress={() => {
                              console.log("navigate to payment invoice:", id);
                              navigation.navigate("PaymentInfor", {
                                appointmentId: id,
                              });
                            }}
                            styles={{
                              paddingVertical: 4,
                              paddingHorizontal: 0,
                              backgroundColor: "transparent",
                            }}
                            textColor={appColor.primary}
                          />
                        </View>
                      )}

                    {step.id === 5 &&
                      effectiveEvcheckStatus.includes("REPAIR_COMPLETED") && (
                        <View style={{ marginTop: 8, alignSelf: "flex-start" }}>
                          <ButtonComponent
                            text="Xem phiếu sửa chữa"
                            type="text"
                            textStyle={{ color: appColor.primary }}
                            onPress={() => {
                              navigation.navigate("RevisedMinutes", {
                                appointmentId: id,
                                evcheckId: evcheckIdState,
                              });
                            }}
                            styles={{
                              paddingVertical: 4,
                              paddingHorizontal: 0,
                              backgroundColor: "transparent",
                            }}
                            textColor={appColor.primary}
                          />
                        </View>
                      )}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <SpaceComponent height={40} />

        <ButtonComponent
          text="Trang chủ"
          type="secondary"
          styles={{
            width: "100%",
            borderWidth: 1,
            borderColor: appColor.gray,
            backgroundColor: appColor.white,
          }}
          textColor={appColor.text}
          onPress={() => navigation.navigate("HomeScreen")}
        />

        <SpaceComponent height={40} />
      </ScrollView>
    </BackgroundComponent>
  );
};

export default RepairProcess;

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColor.white,
    borderRadius: 12,
    padding: 16,
  },
  timelineContainer: {
    marginLeft: 8,
    marginTop: 8,
    position: "relative",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  timelineColumn: {
    alignItems: "center",
    marginRight: 12,
  },
  line: {
    position: "absolute",
    top: -25,
    width: 2,
    height: 25,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  circleActive: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: appColor.primary,
    borderWidth: 2,
    borderColor: appColor.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineFullLine: {
    position: "absolute",
    left: 22,
    top: 0,
    bottom: 0,
    width: 2,
  },
  statusChip: {},
});

const parseISOToDate = (iso?: string): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};
const formatDateDDMMYYYY = (iso?: string) => {
  const d = parseISOToDate(iso);
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const slotCodeToTimeLabel = (code?: string) => {
  if (!code) return "";
  const m = String(code).match(/(\d{1,2})[_\-](\d{1,2})/);
  if (m) {
    const a = m[1].padStart(2, "0");
    const b = m[2].padStart(2, "0");
    return `${a}:00 - ${b}:00`;
  }
  if (code.includes(":")) return code;
  return String(code);
};

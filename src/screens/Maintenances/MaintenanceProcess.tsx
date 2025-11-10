import React, { useEffect, useState, useMemo, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { getAppointmentDetail } from "../../services/appointment.service";
// optional: service to fetch evCheck details (create if not exist)
import { getEvcheckDetail } from "../../services/evcheck.service";
import { globalStyle } from "../../styles/globalStyle";
import useAppointmentHub from "../../hooks/useAppointmentHub.hook";
import useEvcheckHub from "../../hooks/useEVCheckHub";

const mapStatusToStep = (status?: string) => {
  const s = (status || "").toUpperCase();
  if (s.includes("PENDING")) return 1;
  if (s.includes("APPROVED") || s.includes("CONFIRMED")) return 2;
  if (s.includes("CHECKED_IN") || s.includes("VEHICLE_INSPECTION")) return 3;
  if (s.includes("INSPECTION_COMPLETED") || s.includes("QUOTE_APPROVED"))
    return 4;
  if (s.includes("REPAIR_IN_PROGRESS")) return 5;
  if (s.includes("REPAIR_COMPLETED")) return 6;
  if (s.includes("COMPLETE") || s.includes("COMPLETED") || s.includes("DONE"))
    return 7;
  return 1;
};

const MaintenanceProcess = ({ navigation, route }: any) => {
  const id = route?.params?.id;

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
      const res = await getAppointmentDetail(appointmentId);
      if (res.success) {
        setData(res.data);
        // if appointment contains evCheck id, keep it for evcheck hook
        const foundEvcheckId =res.data?.evCheckId;
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

  // set currentStep based on evcheck status if present, otherwise appointment status
  useEffect(() => {
    const sourceStatus =
      effectiveEvcheckStatus && effectiveEvcheckStatus !== ""
        ? effectiveEvcheckStatus
        : effectiveApptStatus;
    if (sourceStatus) {
      setCurrentStep(mapStatusToStep(sourceStatus));
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
      desc: "Xe của bạn đang được bảo dưỡng và sửa chữa theo yêu cầu.",
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
    // if approved present, hide pending; otherwise show pending; keep other flow
    return steps.filter((s) => {
      if (s.id === 1 && effectiveApptStatus.includes("APPROVED")) return false;
      return true;
    });
  }, [steps, effectiveApptStatus]);

  return (
    <BackgroundComponent back title="Quá trình bảo dưỡng">
      <ScrollView showsVerticalScrollIndicator={false}>
        <SpaceComponent height={10} />

        {/* Appointment banner: show one of states */}
        {/* <SectionComponent
          styles={[globalStyle.shadow, { marginHorizontal: 8, padding: 12 }]}
        >
          {effectiveApptStatus.includes("COMPLETED") ? (
            <TextComponent
              text="Hoàn thành"
              size={18}
              font={fontFamilies.roboto_bold}
              color={appColor.primary}
            />
          ) : effectiveApptStatus.includes("CHECKED_IN") ? (
            <TextComponent
              text="Đã check-in — Đang kiểm tra"
              size={18}
              font={fontFamilies.roboto_bold}
              color={appColor.primary}
            />
          ) : effectiveApptStatus.includes("APPROVED") ? (
            <TextComponent
              text="Đã xác nhận"
              size={18}
              font={fontFamilies.roboto_bold}
              color={appColor.primary}
            />
          ) : (
            <TextComponent
              text="Đang đợi xác nhận"
              size={18}
              font={fontFamilies.roboto_bold}
              color={appColor.primary}
            />
          )}

          {(apptDescription || evcheckDescription) && (
            <TextComponent
              text={apptDescription || evcheckDescription || ""}
              size={14}
              color={appColor.gray2}
              styles={{ marginTop: 8 }}
            />
          )}
        </SectionComponent> */}

        <SpaceComponent height={12} />

        {/* EVCheck sections */}
        {/* {effectiveEvcheckStatus.includes("INSPECTION_COMPLETED") && (
          <SectionComponent styles={[globalStyle.shadow, styles.card]}>
            <TextComponent
              text="Kết quả kiểm tra"
              size={18}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <TextComponent
              text="Kỹ thuật đã hoàn tất kiểm tra. Xem chi tiết kết quả."
              size={14}
              color={appColor.gray2}
              styles={{ marginTop: 8 }}
            />
            <SpaceComponent height={8} />
            <ButtonComponent
              text="Xem kết quả kiểm tra"
              type="primary"
              onPress={() =>
                navigation.navigate("InspectionResult", { appointmentId: id })
              }
            />
          </SectionComponent>
        )}

        {effectiveEvcheckStatus.includes("REPAIR_IN_PROGRESS") && (
          <SectionComponent styles={[globalStyle.shadow, styles.card]}>
            <TextComponent
              text="Sửa chữa"
              size={18}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <TextComponent
              text="Xe đang trong quá trình sửa chữa."
              size={14}
              color={appColor.gray2}
              styles={{ marginTop: 8 }}
            />
          </SectionComponent>
        )}

        {effectiveEvcheckStatus.includes("REPAIR_COMPLETED") && (
          <SectionComponent styles={[globalStyle.shadow, styles.card]}>
            <TextComponent
              text="Thanh toán"
              size={18}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <TextComponent
              text="Sửa chữa đã hoàn tất. Vui lòng thanh toán."
              size={14}
              color={appColor.gray2}
              styles={{ marginTop: 8 }}
            />
            <SpaceComponent height={8} />
            <ButtonComponent
              text="Xem hóa đơn thanh toán"
              type="primary"
              onPress={() =>
                navigation.navigate("PaymentInvoice", { appointmentId: id })
              }
            />
          </SectionComponent>
        )}

        <SpaceComponent height={12} /> */}

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

        {/* Service center card */}
        <SectionComponent styles={[globalStyle.shadow, styles.card]}>
          <TextComponent
            text="Trung tâm dịch vụ: "
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            size={18}
          />
          <TextComponent
            text={data?.serviceCenter?.name}
            size={18}
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
            flex={1}
            styles={{ marginTop: 4, marginLeft: 4 }}
          />
          <TextComponent
            text="Xem vấn đề của xe"
            size={13}
            color={appColor.primary}
            styles={{ marginTop: 4, marginLeft: 4 }}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text="Thời gian: "
            size={18}
            font={fontFamilies.roboto_regular}
            color={appColor.text}
          />
          <TextComponent
            text={`${formatDateDDMMYYYY(
              data?.appointmentDate
            )} ${slotCodeToTimeLabel(data?.slotTime)}`}
            color={appColor.text}
            size={18}
            font={fontFamilies.roboto_regular}
            styles={{ marginTop: 4, marginLeft: 4 }}
          />
          <SpaceComponent height={4} />
          <TextComponent
            text={`Địa chỉ: ${
              data?.serviceCenter?.address || "3, Lê Văn Khương, Gò Vấp"
            }`}
            color={appColor.gray2}
            size={18}
          />
          <SpaceComponent height={4} />

          <TextComponent
            text={`Mã dịch vụ: ${data?.code || "6M78239A23P"}`}
            color={appColor.gray2}
            size={18}
          />
        </SectionComponent>

        <SpaceComponent height={25} />

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {filteredSteps.map((step) => (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.timelineColumn}>
                {step.id > 1 && (
                  <View
                    style={[
                      styles.line,
                      {
                        backgroundColor:
                          step.id <= currentStep
                            ? appColor.primary
                            : appColor.gray,
                      },
                    ]}
                  />
                )}

                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor:
                        step.id <= currentStep
                          ? appColor.primary
                          : appColor.gray,
                    },
                  ]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <TextComponent
                  text={step.title}
                  color={
                    step.id === currentStep ? appColor.primary : appColor.text
                  }
                  font={
                    step.id === currentStep
                      ? fontFamilies.roboto_bold
                      : fontFamilies.roboto_medium
                  }
                  size={16}
                />
                {step.desc ? (
                  <View>
                    <TextComponent
                      text={step.desc}
                      color={appColor.gray2}
                      size={14}
                      styles={{ marginTop: 4 }}
                    />

                    {step.id === 4 && (
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

                    {step.id === 6 && (
                      <View style={{ marginTop: 8, alignSelf: "flex-start" }}>
                        <ButtonComponent
                          text="Xem hóa đơn thanh toán"
                          type="text"
                          textStyle={{
                            color: appColor.primary,
                          }}
                          onPress={() =>
                            navigation.navigate("PaymentInvoice", {
                              appointmentId: id,
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
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <SpaceComponent height={40} />

        <RowComponent justify="space-between">
          <ButtonComponent
            text="Hủy yêu cầu"
            type="text"
            styles={{
              flex: 0.48,
              borderWidth: 1,
              borderColor: appColor.gray,
              backgroundColor: appColor.white,
            }}
            textColor={appColor.text}
          />
          <ButtonComponent
            text="Đặt lại lịch"
            type="primary"
            styles={{ flex: 0.48 }}
            onPress={() => navigation.navigate("AppointmentDetailScreen")}
          />
        </RowComponent>

        <SpaceComponent height={40} />
      </ScrollView>
    </BackgroundComponent>
  );
};

export default MaintenanceProcess;

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColor.white,
    borderRadius: 12,
    padding: 16,
  },
  timelineContainer: {
    marginLeft: 8,
    marginTop: 8,
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

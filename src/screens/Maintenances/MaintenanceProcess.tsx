import React, { useEffect, useState, useMemo, useRef, use } from "react";
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
import { getVehicleById } from "../../services/evcheck.service";
import { globalStyle } from "../../styles/globalStyle";
import * as signalR from "@microsoft/signalr";

const mapStatusToStep = (status?: string) => {
  const s = (status || "").toUpperCase();
  if (s.includes("PENDING")) return 1;
  if (s.includes("APPROVED") || s.includes("CONFIRMED")) return 2;
  if (s.includes("CHECKED_IN") || s.includes("VEHICLE_INSPECTION")) return 3;
  if (s.includes("INSPECTION_COMPLETED") || s.includes("QUOTE_APPROVED"))
    return 4;
  if (s.includes("REPAIR_IN_PROGRESS") || s.includes("REPAIR_COMPLETED"))
    return 4;
  if (s.includes("COMPLETE") || s.includes("COMPLETED") || s.includes("DONE"))
    return 5;
  return 1;
};

const MaintenanceProcess = ({ navigation, route }: any) => {
  const id = "6f771d8c-466b-4ff7-bf77-8b7daa2e18d4";
    // route?.params?.appointmentId || "afa36fe3-3e89-40d0-8ad5-9d3ce57c31de";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(4);
  const [statusInfo, setStatusInfo] = useState<any>(null);
  const evCheckId = "14855464-7c39-428b-97d4-29fafc17c771";
  const [rtLogs, setRtLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);

  const addRtLog = (label: string, payload: any) => {
    const line = `${new Date().toLocaleTimeString()} | ${label} | ${
      typeof payload === "object" ? JSON.stringify(payload) : String(payload)
    }`;
    logsRef.current = [line, ...logsRef.current].slice(0, 50); // keep last 50
    setRtLogs([...logsRef.current]);
    // also console
    console.log(line);
  };

  useEffect(() => {
    const update = route?.params?.statusUpdate;
    if (!update) return;
    // nếu backend gửi step dùng trực tiếp
    if (typeof update.step === "number") {
      setCurrentStep(update.step);
    } else if (update.title) {
      // nếu chỉ có title/desc, try map title -> step bằng mapStatusToStep
      setCurrentStep(mapStatusToStep(update.title));
    }
    setStatusInfo({ title: update.title, desc: update.desc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.statusUpdate]);

  // fetch function đặt trước để effect SignalR có thể gọi
  const fetchAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      const res = await getAppointmentDetail(appointmentId);
      if (res.success) {
        setData(res.data);
        setCurrentStep(mapStatusToStep(res.data?.status));
      } else {
        console.log("fetch appointment detail error:", res.message);
      }
    } catch (err) {
      console.log("fetchAppointment error:", err);
    } finally {
      setLoading(false);
    }
  };

  // thêm hàm fetchEvCheck để xử lý realtime evCheckId
  const fetchEvCheck = async (evCheckIdParam: string) => {
    try {
      setLoading(true);
      // nếu bạn có service riêng cho evCheck -> dùng nó
      const res = await getVehicleById(evCheckIdParam);
      if (res.success) {
        console.log("fetched evCheck detail:", res.data);
        // res.data có thể chứa thông
        setData((prev: any) => ({ ...prev, evCheck: res.data }));
        // nếu evCheck có status, map sang step
        if (res.data?.status) {
          setCurrentStep(mapStatusToStep(res.data.status));
        }
        // nếu evCheck trả về appointmentId và bạn muốn cập nhật toàn bộ appointment data
        if (res.data?.appointmentId) {
          await fetchAppointment(String(res.data.appointmentId));
        }
      } else {
        console.log("fetch evCheck detail error:", res.message);
      }
    } catch (err) {
      console.log("fetchEvCheck error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAppointment(id);
    };
    fetchData();
  }, [id]);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiIwOGRlMTc4OS1mMmY1LTRkNWYtODczMy05YjNlNjhiNjliNGIiLCJwaG9uZSI6IjAzODc3OTQ1NjAiLCJyb2xlIjoiUk9MRV9DVVNUT01FUiIsIm5iZiI6MTc2MjI4MDk4OSwiZXhwIjoxNzYyODg1Nzg5LCJpYXQiOjE3NjIyODA5ODksImlzcyI6ImVNb3RvQ2FyZUFQSSIsImF1ZCI6ImVNb3RvQ2FyZUNsaWVudCJ9.kxRpKI6A7MMXkKc21XlKGmOX8x_3S_ssFiQEQ08I_Ks";
  // useEffect(() => {
  //   const hubUrl = "http://bemodernestate.site/hubs/notify";
  //   const connection = new signalR.HubConnectionBuilder()
  //     .withUrl(hubUrl, {
  //       accessTokenFactory: () => token,
  //     })
  //     .withAutomaticReconnect()
  //     .configureLogging(signalR.LogLevel.Information)
  //     .build();

  //   let mounted = true;

  //   const start = async () => {
  //     try {
  //       await connection.start();
  //       if (!mounted) return;
  //       console.log("SignalR Connected.");
  //     } catch (err) {
  //       console.log("SignalR connect failed:", err);
  //     }
  //   };
  //   connection.on("ReceiveUpdate", async (entity: any, payload: any) => {
  //     addRtLog("ReceiveUpdate", { entity, payload });

  //     try {
  //       const ent = String(entity || "").toUpperCase();
  //       let candidate: string | undefined;

  //       if (payload == null) {
  //         candidate = undefined;
  //       } else if (typeof payload === "string" || typeof payload === "number") {
  //         candidate = String(payload);
  //       } else if (typeof payload === "object") {
  //         // Type guards to safely access properties on unknown objects
  //         const isRecord = (v: unknown): v is Record<string, unknown> =>
  //           v !== null && typeof v === "object";

  //         if (isRecord(payload) && typeof payload.evCheckId === "string")
  //           candidate = payload.evCheckId;
  //         else if (isRecord(payload) && typeof payload.evcheckId === "string")
  //           candidate = payload.evcheckId;
  //         else if (isRecord(payload) && typeof payload.id === "string")
  //           candidate = payload.id;
  //         else if (
  //           isRecord(payload) &&
  //           isRecord(payload.id) &&
  //           typeof payload.id.id === "string"
  //         )
  //           candidate = payload.id.id;
  //       }

  //       if (candidate) {
  //         // only handle EVCheck updates (optional: check entity)
  //         if (ent.includes("EVCHECK") || true) {
  //           setEvCheckId(candidate);
  //           addRtLog("evCheckIdDetected", candidate);
  //           await fetchEvCheck(candidate);
  //         }
  //       }
  //     } catch (err) {
  //       addRtLog("ReceiveUpdateError", String(err));
  //     }
  //   });
  //   connection.on("ReceiveDelete", (entity: any, id: any) =>
  //     addRtLog("ReceiveDelete", { entity, id })
  //   );

  //   start();

  //   return () => {
  //     mounted = false;
  //     try {
  //       connection.off("StatusChanged");
  //       connection.off("ReceiveUpdate");
  //       connection.off("ReceiveDelete");
  //       connection.stop().catch(() => {});
  //     } catch {
  //       // ignore
  //     }
  //   };
  // }, [id]);

  useEffect(() => {
    fetchEvCheck(evCheckId);
  }, []);
  const steps = [
    {
      id: 1,
      title: "Đang xử lý yêu cầu",
      desc: "Chúng tôi đang xử lý yêu cầu của bạn và sẽ gửi báo giá sớm.",
    },
    {
      id: 2,
      title: "Đã xử lý yêu cầu",
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
  ];

  const filteredSteps = useMemo(() => {
    if (currentStep >= 2) {
      return steps.filter((s) => s.id !== 1);
    }
    return steps.filter((s) => s.id !== 2);
  }, [currentStep]);

  return (
    <BackgroundComponent back title="Quá trình bảo dưỡng">
      <ScrollView showsVerticalScrollIndicator={false}>
        <SpaceComponent height={10} />
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

        {/* Thẻ thông tin trung tâm dịch vụ */}
        <SectionComponent styles={[globalStyle.shadow, styles.card]}>
          <TextComponent
            text="Trung tâm dịch vụ"
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            size={16}
          />
          <TextComponent
            text="Xem vấn đề của xe"
            size={13}
            color={appColor.primary}
            styles={{ marginTop: 4 }}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text={`Th, ${new Date().toLocaleDateString("vi-VN")}`}
            color={appColor.text}
          />
          <TextComponent
            text={`Thời gian: ${data?.timeSlot || "08:00"}`}
            color={appColor.text}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text={`Địa chỉ: ${
              data?.serviceCenter?.address || "3, Lê Văn Khương, Gò Vấp"
            }`}
            color={appColor.gray2}
          />
          <TextComponent
            text={`Mã dịch vụ: ${data?.code || "6M78239A23P"}`}
            color={appColor.gray2}
          />
        </SectionComponent>

        <SpaceComponent height={25} />

        {/* Tiến trình bảo dưỡng */}
        <View style={styles.timelineContainer}>
          {filteredSteps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              {/* Cột trái: đường nối + chấm tròn */}
              <View style={styles.timelineColumn}>
                {/* Đường nối trên (nếu step.id > 1) */}
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

                {/* Chấm tròn */}
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

              {/* Nội dung bên phải */}
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

        {/* Nút hành động */}
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

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { authSelecter } from "../redux/reducers/authReducer";
import { getAppointmentDetail } from "../services/appointment.service";

export default function useAppointmentHub(appointmentId: string) {
  const [status, setStatus] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const auth = useSelector(authSelecter);

  const fetchAppoinment = async (id: string) => {
    const res = await getAppointmentDetail(id);
    if (res.success) {
      setStatus(res.data.status);
      setDescription(res.data.description ?? "");
    }
  };

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://glvmsfwl-8080.asse.devtunnels.ms/hubs/notifyappointment",
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => auth?.token || "",
        }
      )
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("✅ Connected to appointment hub"))
      .catch((err) => console.error("❌ Connection error:", err));

    connection.on("ReceiveUpdate", (entity: string, data: any) => {
      console.log("📩 ReceiveUpdate:", entity, data);

      // Nếu là dữ liệu của Appointment và ID trùng
      if (entity === "Appointment" && data?.id === appointmentId) {
        fetchAppoinment(appointmentId);
      }
    });

    connection.on("ReceiveApproved", (entity: string, data: any) => {
      console.log("📩 ReceiveApproved:", entity, data);

      // Nếu là dữ liệu của Appointment và ID trùng
      
      if (entity === "Appointment" && data?.id === appointmentId) {
        fetchAppoinment(appointmentId);
      }
    });
    return () => {
      connection.stop();
    };
  }, [appointmentId]);
  return { status, description };
}

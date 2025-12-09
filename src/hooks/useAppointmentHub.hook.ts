import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { authSelecter } from "../redux/reducers/authReducer";
import { getAppointmentById } from "../services/appointment.service";

export default function useAppointmentHub(appointmentId: string) {
  const [status, setStatus] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const auth = useSelector(authSelecter);

  const fetchAppoinment = async (id: string) => {
    const res = await getAppointmentById(id);
    if (res.success) {
      setStatus(res.data.status);
      setDescription(res.data.description ?? "");
    }
  };

  useEffect(() => {
    let isMounted = true;
    let started = false;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${process.env.EXPO_PUBLIC_SIGNALR_SERVER_URL}/hubs/notifyappointment`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => auth?.token || "",
        }
      )
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        started = true;
        console.log("✅ Connected to appointment hub");
        if (!isMounted) {
          // component unmounted while starting - stop immediately
          await connection.stop();
        }
      } catch (err) {
        console.error("❌ Connection error appointment:", err);
      }
    };

    startConnection();

    connection.on("ReceiveUpdate", (entity: string, data: any) => {
      console.log("📩 ReceiveUpdate:", entity, data);

      if (entity === "Appointment" && data?.id === appointmentId) {
        fetchAppoinment(appointmentId);
      }
    });

    connection.on("ReceiveApproved", (entity: string, data: any) => {
      console.log("📩 ReceiveApproved:", entity, data);
      if (entity === "Appointment" && data?.id === appointmentId) {
        fetchAppoinment(appointmentId);
      }
    });

    connection.onreconnecting((err) => {
      console.info("SignalR reconnecting (appointment):", err);
    });

    connection.onreconnected(() => {
      console.info("SignalR reconnected (appointment)");
    });

    connection.onclose((err) => {
      console.info("SignalR connection closed (appointment):", err);
    });

    return () => {
      isMounted = false;
      if (started) {
        connection.stop().catch(() => {});
      }
      // if not started yet, startConnection will stop after it resolves because of isMounted flag
    };
  }, [appointmentId]);
  return { status, description };
}

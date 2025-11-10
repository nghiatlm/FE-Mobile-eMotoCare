import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { authSelecter } from "../redux/reducers/authReducer";
import { getEvcheckDetail } from "../services/evcheck.service";

export default function useEvcheckHub(evcheckId: string) {
  const [status, setStatus] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const auth = useSelector(authSelecter);

  const fetchEvcheck = async (id: string) => {
    const res = await getEvcheckDetail(id);
    if (res.success) {
      setStatus(res.data.status);
      setDescription(res.data.description ?? "");
    }
  };

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://5baf5a624772.ngrok-free.app/hubs/notify",
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
      if (entity === "EVCheck" && data?.id === evcheckId) {
        fetchEvcheck(evcheckId);
      }
    });
    return () => {
      connection.stop();
    };
  }, [evcheckId]);
  return { status, description };
}

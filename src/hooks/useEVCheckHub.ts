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
    let isMounted = true;
    let started = false;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${process.env.EXPO_PUBLIC_SIGNALR_SERVER_URL}/hubs/notify`,
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
        console.log("✅ Connected to Evcheck hub");
        if (!isMounted) {
          await connection.stop();
        }
      } catch (err) {
        console.error("❌ Connection error Evcheck:", err);
      }
    };

    startConnection();

    connection.on("ReceiveUpdate", (entity: string, data: any) => {
      console.log("📩 ReceiveUpdate:", entity, data);

      if (entity === "EVCheck" && data?.id === evcheckId) {
        fetchEvcheck(evcheckId);
      }
    });

    connection.onreconnecting((err) => {
      console.info("SignalR reconnecting (evcheck):", err);
    });

    connection.onreconnected(() => {
      console.info("SignalR reconnected (evcheck)");
    });

    connection.onclose((err) => {
      console.info("SignalR connection closed (evcheck):", err);
    });

    return () => {
      isMounted = false;
      if (started) {
        connection.stop().catch(() => {});
      }
    };
  }, [evcheckId]);
  return { status, description };
}

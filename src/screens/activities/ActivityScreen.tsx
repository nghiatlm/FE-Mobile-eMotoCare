import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BackgroundComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { authSelecter } from "../../redux/reducers/authReducer";
import ActivityComponent from "../home/components/ActivityComponent";
import { getAppointments } from "../../services/appointment.service";
import { getByAccount } from "../../services/customer.service";

const isCompleted = (s?: string) => {
  const t = String(s || "").toUpperCase();
  return t === "SUCCESS" || t === "COMPLETED";
};

const ActivityScreen = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const auth = useSelector(authSelecter);

  useEffect(() => {
    let mounted = true;
    const acctId = auth.accountResponse?.id ?? "";
    setAccountId(acctId);

    const init = async () => {
      try {
        setLoading(true);
        const custId = await fetchCustomerData(acctId);
        if (!mounted) return;
        // await fetchActivities(custId);
      } catch (err) {
        console.warn("fetch activities error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
    // run when account changes
  }, [auth.accountResponse?.id]);

  const fetchActivities = async (custIdParam?: string) => {
    const custId = custIdParam ?? customerId;
    if (!custId) {
      setActivities([]);
      return;
    }
    const res = await getAppointments({
      customerId: custId,
      page: 1,
      pageSize: 10,
    });
    if (res?.success) setActivities(res.data?.rowDatas || []);
  };

  const ongoing = activities.filter((a) => !isCompleted(a.status));
  const completed = activities.filter((a) => isCompleted(a.status));

  const fetchCustomerData = async (acctIdParam?: string) => {
    const acct = acctIdParam ?? accountId;
    if (!acct) return "";
    const res = await getByAccount(String(acct).trim());
    if (res && res.data) {
      const cust = res.data;
      setCustomerId(cust.id || "");
      return cust.id || "";
    }
    return "";
  };

  return (
    <BackgroundComponent title="Hoạt động" back isScroll>
      <TextComponent
        text="Đang diễn ra"
        size={18}
        font={fontFamilies.roboto_bold}
      />
      <SpaceComponent height={8} />
      <ActivityComponent customerId={customerId} filterCompleted={false} />

      <SpaceComponent height={16} />
      <TextComponent
        text="Đã hoàn thành"
        size={18}
        font={fontFamilies.roboto_bold}
      />
      <SpaceComponent height={8} />
      <ActivityComponent customerId={customerId} filterCompleted={true} />
    </BackgroundComponent>
  );
};

export default ActivityScreen;

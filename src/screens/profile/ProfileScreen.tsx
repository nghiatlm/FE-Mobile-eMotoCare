import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { getCustomerByAccount, getCustomerById } from "../../apis/customer.api";
import {
  BackgroundComponent,
  ButtonComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { authSelecter } from "../../redux/reducers/authReducer";

const ProfileScreen = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useSelector(authSelecter);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const accountId = auth?.accountResponse?.id || auth?.id || null;
        console.log("ProfileScreen - accountId:", accountId);
        if (accountId) {
          const res = await getCustomerByAccount(accountId);
          console.log("ProfileScreen - getCustomerByAccount response:", JSON.stringify(res, null, 2));
          if (res.success && res.data?.id) {
            const customerId = res.data.id;
            console.log("ProfileScreen - customerId:", customerId);
            
            const detailRes = await getCustomerById(customerId);
            console.log("ProfileScreen - getCustomerById response:", JSON.stringify(detailRes, null, 2));
            if (detailRes.success) {
              setCustomer(detailRes.data);
              console.log("ProfileScreen - Customer data set:", detailRes.data);
            } else {
              console.log("ProfileScreen - getCustomerById failed:", detailRes.message);
            }
          } else {
            console.log("ProfileScreen - getCustomerByAccount failed:", res.message);
          }
        } else {
          console.log("ProfileScreen - No accountId found");
          setLoading(false);
        }
      } catch (error) {
        console.log("ProfileScreen - Fetch customer failed:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [auth]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If date is invalid, try to parse manually
        const parts = dateString.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            // YYYY-MM-DD format
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          } else {
            // DD-MM-YYYY format
            return dateString;
          }
        }
        return dateString;
      }
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return dateString;
    }
  };

  const formatGender = (gender: string) => {
    if (!gender) return "-";
    const g = gender.toUpperCase();
    if (g === "MALE" || g === "M" || g === "NAM") return "Nam";
    if (g === "FEMALE" || g === "F" || g === "NỮ") return "Nữ";
    return gender;
  };

  const getFullName = () => {
    if (!customer) return "-";
    const firstName = customer.firstName || "";
    const lastName = customer.lastName || "";
    return `${firstName} ${lastName}`.trim() || "-";
  };

  const getPhone = () => {
    // Phone lấy từ account object trong customer data
    return customer?.account?.phone || auth?.phone || "-";
  };

  const getEmail = () => {
    // Email lấy từ account object trong customer data
    return customer?.account?.email || auth?.email || "-";
  };

  const getAvatarSource = () => {
    // Nếu có avatarUrl và không phải placeholder "string", dùng avatarUrl
    if (customer?.avatarUrl && customer.avatarUrl !== "string") {
      return { uri: customer.avatarUrl };
    }
    // Ngược lại dùng default avatar
    return require("../../assets/images/avt_default.png");
  };

  if (loading) {
    return (
      <BackgroundComponent title="Tài khoản" back isScroll>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColor.primary} />
        </View>
      </BackgroundComponent>
    );
  }

  return (
    <BackgroundComponent title="Tài khoản" back isScroll>
      <View style={styles.container}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={getAvatarSource()}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <SpaceComponent height={32} />

        {/* Account Information - Simple Layout */}
        <View style={styles.infoSection}>
          <InfoRow label="Điện thoại" value={getPhone()} />
          <InfoRow label="Họ và tên" value={getFullName()} />
          <InfoRow label="Email" value={getEmail()} />
          <InfoRow label="Giới tính" value={formatGender(customer?.gender)} />
          <InfoRow label="Ngày sinh" value={formatDate(customer?.dateOfBirth)} />
        </View>

        <SpaceComponent height={40} />

        {/* Update Button */}
        <ButtonComponent
          text="Cập nhật thông tin"
          type="primary"
          onPress={() => {
            // TODO: Navigate to update profile screen
            console.log("Update profile pressed");
          }}
        />

        <SpaceComponent height={20} />
      </View>
    </BackgroundComponent>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  return (
    <View style={styles.infoRow}>
      <TextComponent
        text={label}
        size={14}
        color={appColor.gray2}
        font={fontFamilies.roboto_regular}
        styles={styles.label}
      />
      <TextComponent
        text={value}
        size={16}
        color={appColor.text}
        font={fontFamilies.roboto_regular}
        styles={styles.value}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  infoSection: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: appColor.gray,
  },
  label: {
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
});

import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerByAccount, getCustomerById } from "../../apis/customer.api";
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
import { authSelecter, removeAuth } from "../../redux/reducers/authReducer";

const SettingScreen = () => {
  const [customer, setCustomer] = useState<any>(null);
  const auth = useSelector(authSelecter);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const accountId = auth?.accountResponse?.id || auth?.id || null;
        if (accountId) {
          const res = await getCustomerByAccount(accountId);
          if (res.success && res.data?.id) {
            const customerId = res.data.id;
            const detailRes = await getCustomerById(customerId);
            if (detailRes.success) {
              setCustomer(detailRes.data);
            }
          }
        }
      } catch (error) {
        console.log("Fetch customer failed:", error);
      }
    };

    fetchCustomerData();
  }, [auth]);

  const getFullName = () => {
    if (!customer) return "Nguyễn Văn A";
    const firstName = customer.firstName || "";
    const lastName = customer.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Nguyễn Văn A";
  };

  const getPhone = () => {
    return customer?.account?.phone || auth?.phone || "0329-449-930";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "05/09/2025";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "05/09/2025";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return "05/09/2025";
    }
  };

  const getActiveFromDate = () => {
    return formatDate(customer?.createdAt || customer?.account?.createdAt);
  };

  const getAvatarSource = () => {
    if (customer?.avatarUrl && customer.avatarUrl !== "string") {
      return { uri: customer.avatarUrl };
    }
    return require("../../assets/images/avt_default.png");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("auth");
      await AsyncStorage.removeItem("ACCESS_TOKEN");
      dispatch(removeAuth({} as any));
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Thêm phương tiện mới",
      icon: <AntDesign name="plus-circle" size={24} color={appColor.primary} />,
      onPress: () => {
        console.log("Thêm phương tiện mới");
      },
    },
    {
      id: 2,
      title: "Khuyến mãi",
      icon: <MaterialIcons name="local-offer" size={24} color={appColor.primary} />,
      onPress: () => {
        console.log("Khuyến mãi");
      },
    },
    {
      id: 3,
      title: "Lịch sử hoạt động",
      icon: <Ionicons name="time-outline" size={24} color={appColor.primary} />,
      onPress: () => {
        console.log("Lịch sử hoạt động");
      },
    },
    {
      id: 4,
      title: "Trung tâm trợ giúp",
      icon: <Ionicons name="help-circle-outline" size={24} color={appColor.primary} />,
      onPress: () => {
        console.log("Trung tâm trợ giúp");
      },
    },
    {
      id: 5,
      title: "Điều khoản",
      icon: <MaterialIcons name="description" size={24} color={appColor.primary} />,
      onPress: () => {
        console.log("Điều khoản");
      },
    },
    {
      id: 6,
      title: "Chuyển đổi ngôn ngữ",
      icon: <Ionicons name="language-outline" size={24} color={appColor.primary} />,
      onPress: () => {
        console.log("Chuyển đổi ngôn ngữ");
      },
    },
  ];

  return (
    <BackgroundComponent title="Cài đặt" back isScroll>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <SectionComponent styles={styles.userCard}>
            <RowComponent>
              <View style={styles.avatarContainer}>
                <Image
                  source={getAvatarSource()}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.userInfo}>
                <TextComponent
                  text={getFullName()}
                  size={16}
                  color={appColor.text}
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent
                  text={getPhone()}
                  size={18}
                  color={appColor.text}
                  font={fontFamilies.roboto_bold}
                  styles={{ marginTop: 4 }}
                />
                <TextComponent
                  text={`Hoạt động từ: ${getActiveFromDate()}`}
                  size={12}
                  color={appColor.gray2}
                  styles={{ marginTop: 4 }}
                />
              </View>
            </RowComponent>
          </SectionComponent>
        </TouchableOpacity>

        <SpaceComponent height={24} />

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>{item.icon}</View>
              <TextComponent
                text={item.title}
                size={16}
                color={appColor.text}
                font={fontFamilies.roboto_regular}
                styles={styles.menuText}
              />
              <Ionicons
                name="chevron-forward"
                size={20}
                color={appColor.gray2}
              />
            </TouchableOpacity>
          ))}
        </View>

        <SpaceComponent height={32} />

        <ButtonComponent
          text="Đăng xuất"
          type="primary"
          onPress={handleLogout}
          color={appColor.primary}
          leftIcon={
            <Ionicons name="log-out-outline" size={20} color={appColor.white} />
          }
          textColor={appColor.white}
        />

        <SpaceComponent height={16} />

        <View style={styles.versionContainer}>
          <TextComponent
            text="Phiên bản: 1.01.1"
            size={12}
            color={appColor.gray2}
            styles={{ textAlign: "center" }}
          />
        </View>

        <SpaceComponent height={20} />
      </View>
    </BackgroundComponent>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: appColor.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  menuContainer: {
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: appColor.gray,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  versionContainer: {
    alignItems: "center",
  },
});

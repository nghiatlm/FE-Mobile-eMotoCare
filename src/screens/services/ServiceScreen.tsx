import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";
import { globalStyle } from "../../styles/globalStyle";
import { formatSlotTime } from "../../utils/formatSlotTime";
import { getAppointments } from "../../services/appointment.service";
import { useSelector } from "react-redux";
import { authSelecter } from "../../redux/reducers/authReducer";
import { getByAccount } from "../../services/customer.service";
import { formatDateDDMMYYYY } from "../../utils/formatDate";

const ServiceScreen = ({ navigation }: any) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const auth = useSelector(authSelecter);

  useEffect(() => {
    fecthCustomer(auth?.accountResponse?.id);
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchData(1, true);
    }
  }, [customerId]);

  const filteredData = appointments.filter(
    (item) => item.status !== "COMPLETED" && item.status !== "CANCELED"
  );

  const fecthCustomer = async (acc: string) => {
    const res = await getByAccount(acc);
    if (res.success) {
      setCustomerId(res.data?.id);
    } else {
      console.log("Failed to fetch customer:", res.message);
    }
  };

  const fetchData = async (pageNum: number, reset: boolean = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    const pageParams = {
      page: pageNum,
      pageSize: 5,
      customerId: customerId,
    };

    const res = await getAppointments(pageParams);
    if (res.success) {
      const newData = res.data.rowDatas || [];
      if (reset) {
        setAppointments(newData);
        setPage(1);
      } else {
        setAppointments((prev) => [...prev, ...newData]);
      }
      setHasMore(newData.length >= 10);
    } else {
      if (reset) {
        setAppointments([]);
      }
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  };

  return (
    <BackgroundComponent title="Dịch vụ" back>
      <SectionComponent
        styles={{
          marginLeft: -12,
          marginRight: -12,
        }}
      >
        <TextComponent
          text="Các loại dịch vụ"
          size={16}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
          styles={{ marginVertical: 8 }}
        />
        <ButtonComponent
          leftIcon={
            <FontAwesome6 name="car-side" size={18} color={appColor.primary} />
          }
          rightIcon={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="chevron-right"
                size={16}
                color={appColor.gray2}
              />
            </View>
          }
          text="Bảo dưỡng"
          textStyle={{
            fontFamily: fontFamilies.roboto_bold,
            fontSize: 16,
          }}
          onPress={() =>
            navigation.navigate("Appointments", {
              screen: "CreateAppointment",
              params: {
                type: "MAINTENANCE_TYPE",
              },
            })
          }
        />
        <ButtonComponent
          leftIcon={
            <FontAwesome6 name="wrench" size={18} color={appColor.primary} />
          }
          rightIcon={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: appColor.warning,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 8,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: 12,
                    fontFamily: fontFamilies.roboto_medium,
                  }}
                >
                  Mới
                </Text>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={16}
                color={appColor.gray2}
              />
            </View>
          }
          text="Sửa chữa"
          textStyle={{ fontFamily: fontFamilies.roboto_bold, fontSize: 16 }}
          onPress={() =>
            navigation.navigate("Appointments", {
              screen: "CreateAppointment",
              params: {
                type: "REPAIR_TYPE",
              },
            })
          }
        />
        <ButtonComponent
          leftIcon={
            <FontAwesome6 name="shield" size={18} color={appColor.primary} />
          }
          rightIcon={
            <FontAwesome6
              name="chevron-right"
              size={16}
              color={appColor.gray2}
            />
          }
          text="Bảo hành"
          textStyle={{ fontFamily: fontFamilies.roboto_bold, fontSize: 16 }}
        />
      </SectionComponent>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;
          if (isCloseToBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <SectionComponent
          styles={{
            marginHorizontal: -10,
          }}
        >
          <TextComponent
            text="Các dịch vụ đang sử dụng"
            size={16}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
          />

          {filteredData && filteredData.length > 0
            ? filteredData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    globalStyle.shadow,
                    {
                      backgroundColor: appColor.white,
                      padding: 12,
                      borderRadius: 8,
                      marginTop: 12,
                      borderColor: appColor.gray,
                      borderWidth: 0.5,
                    },
                  ]}
                >
                  <TextComponent
                    text={
                      item.type === "MAINTENANCE_TYPE"
                        ? "Bảo dưỡng định kỳ"
                        : "Sửa chữa"
                    }
                    size={14}
                    font={fontFamilies.roboto_bold}
                    color={appColor.primary}
                  />
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: appColor.gray2,
                      marginVertical: 8,
                      width: "100%",
                    }}
                  />
                  <SpaceComponent height={8} />
                  <RowComponent
                    justify="flex-start"
                    styles={{ alignItems: "flex-start" }}
                  >
                    <View style={{ width: 26, alignItems: "center" }}>
                      <Ionicons
                        name="time-outline"
                        color={appColor.gray2}
                        size={20}
                      />
                    </View>

                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <TextComponent
                        text="Thời gian: "
                        size={14}
                        color={appColor.gray2}
                        font={fontFamilies.roboto_regular}
                      />
                      <TextComponent
                        text={`${formatDateDDMMYYYY(
                          item.appointmentDate
                        )} ${formatSlotTime(item.slotTime)}`}
                        size={14}
                        font={fontFamilies.roboto_medium}
                        color={appColor.text}
                        styles={{ marginTop: 4 }}
                      />
                    </View>
                  </RowComponent>

                  <SpaceComponent height={8} />
                  <RowComponent
                    justify="flex-start"
                    styles={{ alignItems: "flex-start" }}
                  >
                    <View style={{ width: 26, alignItems: "center" }}>
                      <MaterialIcons
                        name="home-work"
                        color={appColor.gray2}
                        size={20}
                      />
                    </View>

                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <TextComponent
                        text="Trung tâm thực hiện: "
                        size={14}
                        color={appColor.gray2}
                        font={fontFamilies.roboto_regular}
                      />
                      <TextComponent
                        text={item.serviceCenter.name}
                        size={14}
                        font={fontFamilies.roboto_medium}
                        color={appColor.text}
                        styles={{ marginTop: 4 }}
                      />
                    </View>
                  </RowComponent>

                  <SpaceComponent height={8} />
                  <RowComponent
                    justify="flex-start"
                    styles={{ alignItems: "flex-start" }}
                  >
                    <View style={{ width: 26, alignItems: "center" }}>
                      <Fontisto
                        name="motorcycle"
                        color={appColor.gray2}
                        size={20}
                      />
                    </View>

                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <TextComponent
                        text="Xe đang thực hiện: "
                        size={14}
                        color={appColor.gray2}
                        font={fontFamilies.roboto_regular}
                      />
                      <TextComponent
                        text={
                          item.vehicle.modelName
                            ? "Kiểu xe: " + item.vehicle.modelName
                            : ""
                        }
                        size={14}
                        font={fontFamilies.roboto_medium}
                        color={appColor.text}
                        styles={{ marginTop: 4 }}
                      />
                      <TextComponent
                        text={
                          item.vehicle.chassisNumber
                            ? "Số khung: " + item.vehicle.chassisNumber
                            : ""
                        }
                        size={14}
                        font={fontFamilies.roboto_medium}
                        color={appColor.text}
                        styles={{ marginTop: 4 }}
                      />
                    </View>
                  </RowComponent>
                  <SpaceComponent height={12} />
                  <ButtonComponent
                    text="Xem chi tiết"
                    type="secondary"
                    styles={{ height: 38, paddingVertical: 6 }}
                    textStyle={{ fontSize: 12 }}
                  />
                </View>
              ))
            : null}

          {!loading && filteredData.length === 0 && (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <FontAwesome5 name="box-open" size={60} color={appColor.gray} />
              <SpaceComponent height={12} />
              <TextComponent
                text="Đang không sử dụng dịch vụ nào"
                size={14}
                color={appColor.gray2}
                font={fontFamilies.roboto_light}
              />
            </View>
          )}
        </SectionComponent>

        <SpaceComponent height={50} />
      </ScrollView>
    </BackgroundComponent>
  );
};

export default ServiceScreen;

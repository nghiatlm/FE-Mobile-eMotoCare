import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Image,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  BackgroundComponent,
  ButtonComponent,
  DividerWithLabelComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";
import { approveEvcheck, getEvcheckDetail } from "../../services/evcheck.service";

const InspectionResult = ({ navigation, route }: any) => {
  const evCheckId = route?.params?.evcheck || route?.params?.evCheckId;

  const [evCheck, setEvCheck] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (evCheckId) fetchEvcheck(evCheckId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evCheckId]);

  const fetchEvcheck = async (id: string) => {
    try {
      setLoading(true);
      const res = await getEvcheckDetail(id);
      if (res.success) {
        setEvCheck(res.data);
      } else {
        console.warn("Fetch evcheck detail failed:", res.message);
      }
    } catch (e) {
      console.warn("Fetch evcheck exception:", e);
    } finally {
      setLoading(false);
    }
  };

  const confirmHandler = async () => {
    const result = await approveEvcheck(evCheckId);
        console.log("Approve result:", result.message);
        if (result.success) {
          console.log("Success: ", result.data);
          navigation.navigate("MaintenanceProcess", { id: evCheck?.appointment?.id });
        } else {
          console.log("Failed: ", result.message);
        }
    // navigation.navigate("MaintenanceProcess", {
    //   evCheckId,
    //   statusUpdate: {
    //     step: 5,
    //     title: "Sửa chữa",
    //     desc: "Phương tiện của bạn đang được sửa chữa",
    //   },
    // });
  };

  const cancelHandler = () => navigation.goBack();

  const renderDetail = ({ item }: { item: any }) => {
    const part = item?.partItem || item?.replacePart;
    const title =
      part?.serialNumber ||
      part?.part ||
      `Linh kiện ${item?.id?.slice?.(0, 6) ?? ""}`;
    const qty = item?.quantity ?? 0;
    const pricePart = item?.pricePart ?? 0;
    const total = item?.totalAmount ?? pricePart * qty;

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemLeft}>
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={styles.partImage}
          />
        </View>

        <View style={styles.itemRight}>
          <SpaceComponent height={8} />

          <TextComponent
            text={`Tình trạng: ${item?.result ?? "Chưa có"}`}
            size={13}
          />
          <SpaceComponent height={6} />
          <TextComponent
            text={`Giải pháp: ${item?.remedies ?? "NONE"}`}
            size={13}
          />
          <SpaceComponent height={8} />

          <RowComponent justify="flex-start" styles={{ gap: 12 }}>
            <View style={styles.metaBox}>
              <TextComponent text="Số lượng" size={12} color={appColor.gray2} />
              <TextComponent
                text={`${qty} ${item?.unit ?? ""}`}
                size={14}
                font={fontFamilies.roboto_medium}
              />
            </View>

            <View style={styles.metaBox}>
              <TextComponent
                text="Giá linh kiện"
                size={12}
                color={appColor.gray2}
              />
              <TextComponent
                text={`${(pricePart || 0).toLocaleString?.() ?? pricePart} VND`}
                size={14}
                font={fontFamilies.roboto_medium}
              />
            </View>

            <View style={styles.metaBox}>
              <TextComponent text="Tổng" size={12} color={appColor.gray2} />
              <TextComponent
                text={`${(total || 0).toLocaleString?.() ?? total} VND`}
                size={14}
                font={fontFamilies.roboto_bold}
                color={appColor.primary}
              />
            </View>
          </RowComponent>
        </View>
      </View>
    );
  };

  const totalAmount = evCheck?.evCheckDetails
    ? evCheck.evCheckDetails.reduce(
        (s: number, d: any) => s + (d?.totalAmount ?? 0),
        0
      )
    : 0;

  const footer = (
    <View style={styles.footer}>
      <RowComponent styles={{ width: "100%" }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <ButtonComponent
            text="Hủy"
            onPress={cancelHandler}
            styles={[
              styles.footerBtn,
              { backgroundColor: "#E53935", borderColor: "#E53935" },
            ]}
            textStyle={{
              color: "#fff",
              fontSize: 16,
              fontFamily: fontFamilies.roboto_medium,
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ButtonComponent
            text="Xác nhận"
            onPress={confirmHandler}
            styles={[
              styles.footerBtn,
              {
                backgroundColor: appColor.primary,
                borderColor: appColor.primary,
              },
            ]}
            textStyle={{
              color: "#fff",
              fontSize: 16,
              fontFamily: fontFamilies.roboto_medium,
            }}
          />
        </View>
      </RowComponent>
    </View>
  );

  return (
    <BackgroundComponent back title="Kết quả kiểm tra" isScroll footer={footer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <SpaceComponent height={12} />

        <SectionComponent styles={[globalStyle.row, styles.infoCard]}>
          <RowComponent
            justify="flex-start"
            styles={{ gap: 12, alignItems: "flex-start", flex: 1 }}
          >
            <Ionicons
              name="information-circle-outline"
              size={30}
              color={appColor.primary}
            />
            <View style={{ flex: 1 }}>
              <TextComponent
                text="Thông tin chung"
                size={18}
                font={fontFamilies.roboto_medium}
              />
              <SpaceComponent height={10} />
              <TextComponent
                text={`Kiểu xe: ${
                  evCheck?.appointment?.vehicle?.model ?? "VINFAST KLARA"
                }`}
                size={14}
                styles={{ marginTop: 2 }}
              />
              <TextComponent
                text={`Nội dung: ${
                  evCheck?.appointment?.type ?? "Bảo dưỡng định kỳ"
                }`}
                size={14}
                styles={{ marginTop: 4 }}
              />
            </View>
          </RowComponent>
        </SectionComponent>

        <SpaceComponent height={12} />

        <SectionComponent styles={[globalStyle.row, styles.infoCard]}>
          <RowComponent
            justify="flex-start"
            styles={{ gap: 12, alignItems: "flex-start", flex: 1 }}
          >
            <AntDesign name="user-switch" size={30} color={appColor.primary} />
            <View style={{ flex: 1 }}>
              <TextComponent
                text="Nhân viên thực hiện"
                size={18}
                font={fontFamilies.roboto_medium}
              />
              <SpaceComponent height={8} />
              <TextComponent
                text={`${evCheck?.taskExecutor?.firstName ?? ""} ${
                  evCheck?.taskExecutor?.lastName ?? ""
                }`}
                size={14}
                styles={{ marginTop: 2 }}
              />
              <TextComponent
                text={evCheck?.taskExecutor?.position ?? ""}
                size={14}
                styles={{ marginTop: 4 }}
              />
            </View>
          </RowComponent>
        </SectionComponent>

        <SpaceComponent height={16} />

        <SectionComponent
          styles={{ paddingHorizontal: 12, paddingVertical: 12 }}
        >
          <RowComponent justify="flex-start">
            <Octicons name="checklist" size={22} color={appColor.primary} />
            <TextComponent
              text="Kết quả kiểm tra"
              title
              color={appColor.primary}
              font={fontFamilies.roboto_medium}
              styles={{ marginLeft: 8 }}
            />
          </RowComponent>

          <SpaceComponent height={12} />

          {evCheck?.evCheckDetails && evCheck.evCheckDetails.length > 0 ? (
            <FlatList
              data={evCheck.evCheckDetails}
              renderItem={renderDetail}
              keyExtractor={(i) =>
                i.id ?? i.partItem?.id ?? Math.random().toString()
              }
              ItemSeparatorComponent={() => <SpaceComponent height={8} />}
              scrollEnabled={false}
              contentContainerStyle={{ paddingTop: 8 }}
            />
          ) : (
            <TextComponent
              text="Chưa có kết quả kiểm tra."
              size={14}
              color={appColor.gray2}
              styles={{ marginTop: 8 }}
            />
          )}

          {evCheck?.evCheckDetails && evCheck.evCheckDetails.length > 0 && (
            <>
              <SpaceComponent height={12} />
              <DividerWithLabelComponent />
              <SpaceComponent height={12} />
              <RowComponent
                justify="space-between"
                styles={{ alignItems: "center" }}
              >
                <TextComponent
                  text="Tổng chi phí linh kiện"
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent
                  text={`${totalAmount.toLocaleString?.() ?? totalAmount} VND`}
                  font={fontFamilies.roboto_bold}
                  color={appColor.primary}
                />
              </RowComponent>
            </>
          )}
        </SectionComponent>

        <SpaceComponent height={24} />
      </ScrollView>
    </BackgroundComponent>
  );
};

export default InspectionResult;

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: appColor.white,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColor.gray,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 8,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: appColor.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    padding: 12,
    alignItems: "flex-start",
  },
  itemLeft: {
    width: 84,
    height: 84,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },
  partImage: {
    width: 72,
    height: 72,
    resizeMode: "contain",
  },
  itemRight: {
    flex: 1,
    marginLeft: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaBox: {
    minWidth: 90,
  },
  footer: {
    padding: 12,
    backgroundColor: appColor.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  footerBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

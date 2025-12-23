import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getCustomerByAccount, getCustomerById, updateCustomer } from "../../apis/customer.api";
import {
  BackgroundComponent,
  ButtonComponent,
  InputComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { authSelecter } from "../../redux/reducers/authReducer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState<string>("");
  const [tempAddress, setTempAddress] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);
  const auth = useSelector(authSelecter);
  const insets = useSafeAreaInsets();

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
              const gender = detailRes.data?.gender?.toUpperCase();
              if (gender === "MALE" || gender === "M" || gender === "NAM") {
                setSelectedGender("MALE");
              } else if (gender === "FEMALE" || gender === "F" || gender === "NỮ") {
                setSelectedGender("FEMALE");
              } else {
                setSelectedGender("");
              }
              // Set initial temp values
              setTempEmail(detailRes.data?.account?.email || auth?.email || "");
              setTempAddress(detailRes.data?.address || "");
              // Set initial date for date picker
              if (detailRes.data?.dateOfBirth) {
                try {
                  const dateStr = detailRes.data.dateOfBirth;
                  const date = new Date(dateStr);
                  if (!isNaN(date.getTime())) {
                    setSelectedDate(date);
                  }
                } catch (e) {
                  console.log("Error parsing date:", e);
                }
              }
              console.log("ProfileScreen - Customer data set:", detailRes.data);
            } else {
              console.log("ProfileScreen - getCustomerById failed:", detailRes.message);
            }
          } else {
            console.log("ProfileScreen - getCustomerByAccount failed:", res.message);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
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
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const parts = dateString.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          } else {
            return dateString;
          }
        }
        return dateString;
      }
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      // Format đẹp hơn: "23 tháng 12, 2025"
      const monthNames = [
        "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
        "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
      ];
      return `${day} ${monthNames[month - 1]}, ${year}`;
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
    return customer?.account?.phone || auth?.phone || "-";
  };

  const getEmail = () => {
    return customer?.account?.email || auth?.email || "-";
  };

  const getAddress = () => {
    if (!customer?.address) return "-";
    return customer.address;
  };

  const getAvatarSource = () => {
    const src = customer?.avatarUrl;
    if (src && src !== "string") {
      return { uri: src };
    }
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
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={getAvatarSource()}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.cameraBadge} activeOpacity={1}>
              <Feather name="camera" size={16} color={appColor.white} />
            </TouchableOpacity>
          )}
        </View>

        <SpaceComponent height={32} />

        <View style={styles.infoSection}>
          <InfoRow
            label="Điện thoại"
            value={getPhone()}
            required
            showEdit={false}
          />
          <InfoRow
            label="Họ và tên"
            value={getFullName()}
            required
            showEdit={false}
          />
          <InfoRow
            label="Email"
            value={getEmail()}
            showEdit={isEditing}
            isEditingField={editingField === "email"}
            tempValue={tempEmail}
            onTempValueChange={setTempValue => {
              setTempEmail(setTempValue);
              if (customer) {
                setCustomer({
                  ...customer,
                  account: {
                    ...customer.account,
                    email: setTempValue,
                  },
                });
              }
            }}
            onPress={() => {
              if (isEditing) {
                setEditingField("email");
                setTempEmail(getEmail());
              }
            }}
            onBlur={() => {
              setEditingField(null);
            }}
          />
          <InfoRow
            label="Địa chỉ"
            value={getAddress()}
            showEdit={isEditing}
            isEditingField={editingField === "address"}
            tempValue={tempAddress}
            onTempValueChange={setTempValue => {
              setTempAddress(setTempValue);
              if (customer) {
                setCustomer({
                  ...customer,
                  address: setTempValue,
                });
              }
            }}
            onPress={() => {
              if (isEditing) {
                setEditingField("address");
                setTempAddress(getAddress());
              }
            }}
            onBlur={() => {
              setEditingField(null);
            }}
          />
          <GenderRow
            label="Giới tính"
            value={formatGender(customer?.gender)}
            selectedGender={selectedGender}
            onGenderChange={setSelectedGender}
            isEditing={isEditing}
          />
          <DateRow
            label="Ngày sinh"
            value={formatDate(customer?.dateOfBirth)}
            isEditing={isEditing}
            onPress={() => {
              if (isEditing) {
                setShowDatePicker(true);
                setTimeout(() => {
                  const day = selectedDate.getDate() - 1;
                  const month = selectedDate.getMonth();
                  const year = selectedDate.getFullYear();
                  const currentYear = new Date().getFullYear();
                  const yearIndex = year - (currentYear - 100);
                  
                  dayScrollRef.current?.scrollTo({ y: day * 40, animated: false });
                  monthScrollRef.current?.scrollTo({ y: month * 40, animated: false });
                  yearScrollRef.current?.scrollTo({ y: yearIndex * 40, animated: false });
                }, 100);
              }
            }}
          />
        </View>

        <SpaceComponent height={40} />

        {isEditing ? (
          <View style={styles.buttonContainer}>
            <ButtonComponent
              text={isSaving ? "Đang lưu..." : "Lưu"}
              type="primary"
              disabled={isSaving}
              onPress={async () => {
                if (!customer?.id) {
                  console.log("Customer ID not found");
                  return;
                }

                try {
                  setIsSaving(true);
                  
                  let dateOfBirthISO = null;
                  if (customer?.dateOfBirth) {
                    try {
                      const date = new Date(customer.dateOfBirth);
                      if (!isNaN(date.getTime())) {
                        dateOfBirthISO = date.toISOString();
                      }
                    } catch (e) {
                      console.log("Error formatting date:", e);
                    }
                  }

                  const updateData = {
                    accountId: customer?.accountId || customer?.account?.id || auth?.accountResponse?.id || auth?.id,
                    firstName: customer?.firstName || "",
                    lastName: customer?.lastName || "",
                    address: customer?.address || "",
                    citizenId: customer?.citizenId || "",
                    dateOfBirth: dateOfBirthISO,
                    gender: selectedGender || customer?.gender || null,
                    avatarUrl: customer?.avatarUrl || "",
                  };

                  console.log("Updating customer with data:", updateData);
                  
                  const res = await updateCustomer(customer.id, updateData);
                  
                  if (res.success) {
                    console.log("Customer updated successfully");
                    // Refresh customer data
                    const accountId = auth?.accountResponse?.id || auth?.id || null;
                    if (accountId) {
                      const customerRes = await getCustomerByAccount(accountId);
                      if (customerRes.success && customerRes.data?.id) {
                        const detailRes = await getCustomerById(customerRes.data.id);
                        if (detailRes.success) {
                          setCustomer(detailRes.data);
                        }
                      }
                    }
                    setIsEditing(false);
                    setEditingField(null);
                  } else {
                    console.log("Update failed:", res.message);
                    alert(res.message || "Cập nhật thất bại. Vui lòng thử lại.");
                  }
                } catch (error: any) {
                  console.log("Update error:", error);
                  const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
                  alert(errorMessage);
                } finally {
                  setIsSaving(false);
                }
              }}
              styles={{ marginBottom: 0, minHeight: 48 }}
            />
            <ButtonComponent
              text="Hủy"
              type="secondary"
              onPress={() => {
                setIsEditing(false);
                setEditingField(null);
                setTempEmail(getEmail());
                setTempAddress(getAddress());
                const gender = customer?.gender?.toUpperCase();
                if (gender === "MALE" || gender === "M" || gender === "NAM") {
                  setSelectedGender("MALE");
                } else if (gender === "FEMALE" || gender === "F" || gender === "NỮ") {
                  setSelectedGender("FEMALE");
                } else {
                  setSelectedGender("");
                }
              }}
              styles={{ marginBottom: 0, minHeight: 48 }}
            />
          </View>
        ) : (
          <ButtonComponent
            text="Cập nhật thông tin"
            type="primary"
            onPress={() => {
              setIsEditing(true);
            }}
          />
        )}

        <SpaceComponent height={24} />
      </View>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          />
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerHeader}>
              <TextComponent
                text="Chọn ngày sinh"
                size={18}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
              />
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color={appColor.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContent}>
              <View style={styles.wheelPickerContainer}>
                {/* Day Column */}
                <View style={styles.wheelColumn}>
                  <ScrollView
                    ref={dayScrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.wheelScrollContent}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onScroll={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      const newDate = new Date(selectedDate);
                      newDate.setDate(Math.max(1, Math.min(31, index + 1)));
                      setSelectedDate(newDate);
                    }}
                    scrollEventThrottle={16}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <View key={day} style={styles.wheelItem}>
                        <TextComponent
                          text={String(day).padStart(2, "0")}
                          size={18}
                          color={
                            selectedDate.getDate() === day
                              ? appColor.primary
                              : appColor.gray2
                          }
                          font={
                            selectedDate.getDate() === day
                              ? fontFamilies.roboto_bold
                              : fontFamilies.roboto_regular
                          }
                        />
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.wheelSelector} />
                </View>

                {/* Month Column */}
                <View style={styles.wheelColumn}>
                  <ScrollView
                    ref={monthScrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.wheelScrollContent}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onScroll={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(Math.max(0, Math.min(11, index)));
                      setSelectedDate(newDate);
                    }}
                    scrollEventThrottle={16}
                  >
                    {[
                      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
                    ].map((month, index) => (
                      <View key={index} style={styles.wheelItem}>
                        <TextComponent
                          text={month}
                          size={18}
                          color={
                            selectedDate.getMonth() === index
                              ? appColor.primary
                              : appColor.gray2
                          }
                          font={
                            selectedDate.getMonth() === index
                              ? fontFamilies.roboto_bold
                              : fontFamilies.roboto_regular
                          }
                        />
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.wheelSelector} />
                </View>

                {/* Year Column */}
                <View style={styles.wheelColumn}>
                  <ScrollView
                    ref={yearScrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.wheelScrollContent}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onScroll={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const currentYear = new Date().getFullYear();
                      const startYear = currentYear - 100;
                      const index = Math.round(offsetY / 40);
                      const year = Math.max(startYear, Math.min(currentYear, startYear + index));
                      const newDate = new Date(selectedDate);
                      newDate.setFullYear(year);
                      setSelectedDate(newDate);
                    }}
                    scrollEventThrottle={16}
                  >
                    {Array.from({ length: 101 }, (_, i) => {
                      const year = new Date().getFullYear() - 100 + i;
                      return (
                        <View key={year} style={styles.wheelItem}>
                          <TextComponent
                            text={String(year)}
                            size={18}
                            color={
                              selectedDate.getFullYear() === year
                                ? appColor.primary
                                : appColor.gray2
                            }
                            font={
                              selectedDate.getFullYear() === year
                                ? fontFamilies.roboto_bold
                                : fontFamilies.roboto_regular
                            }
                          />
                        </View>
                      );
                    })}
                  </ScrollView>
                  <View style={styles.wheelSelector} />
                </View>
              </View>
            </View>

            <View style={[styles.datePickerFooter, { paddingBottom: Math.max(insets.bottom + 30, 16) }]}>
              <ButtonComponent
                text="Xác nhận"
                type="primary"
                onPress={() => {
                  if (customer) {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                    const day = String(selectedDate.getDate()).padStart(2, "0");
                    const formattedDate = `${year}-${month}-${day}`;
                    setCustomer({ ...customer, dateOfBirth: formattedDate });
                  }
                  setShowDatePicker(false);
                }}
                styles={{ marginBottom: 0, width: "80%", alignSelf: "center" }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </BackgroundComponent>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  required?: boolean;
  showEdit?: boolean;
  isEditingField?: boolean;
  tempValue?: string;
  onTempValueChange?: (val: string) => void;
  onPress?: () => void;
  onBlur?: () => void;
}

const InfoRow = ({
  label,
  value,
  required,
  showEdit,
  isEditingField,
  tempValue,
  onTempValueChange,
  onPress,
  onBlur,
}: InfoRowProps) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.labelRow}>
        <TextComponent
          text={label}
          size={14}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
        />
        {required && (
          <TextComponent
            text="*"
            size={14}
            color={appColor.danger}
            font={fontFamilies.roboto_regular}
            styles={{ marginLeft: 2 }}
          />
        )}
      </View>
      {isEditingField ? (
        <View style={styles.valueRow}>
          <TextInput
            style={styles.textInput}
            value={tempValue || ""}
            onChangeText={onTempValueChange}
            placeholder={`Nhập ${label.toLowerCase()}`}
            placeholderTextColor={appColor.gray2}
            keyboardType={label.toLowerCase() === "email" ? "email-address" : "default"}
            autoFocus
            onBlur={onBlur}
          />
          {showEdit && (
            <View style={styles.editIcon}>
              <Feather name="edit-2" size={16} color={appColor.primary} />
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.valueRow}
          onPress={onPress}
          activeOpacity={showEdit ? 0.7 : 1}
          disabled={!showEdit}
        >
          <View style={styles.valueContainer}>
            <TextComponent
              text={value}
              size={16}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
              styles={styles.value}
              numberOfLines={3}
            />
          </View>
          {showEdit && (
            <View style={styles.editIcon}>
              <Feather name="edit-2" size={16} color={appColor.primary} />
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

interface GenderRowProps {
  label: string;
  value: string;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  isEditing: boolean;
}

const GenderRow = ({ label, value, selectedGender, onGenderChange, isEditing }: GenderRowProps) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.labelRow}>
        <TextComponent
          text={label}
          size={14}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
        />
      </View>
      {isEditing ? (
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => onGenderChange("MALE")}
            activeOpacity={0.7}
          >
            <View style={styles.radioButton}>
              {selectedGender === "MALE" && <View style={styles.radioButtonInner} />}
            </View>
            <TextComponent
              text="Nam"
              size={16}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
              styles={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => onGenderChange("FEMALE")}
            activeOpacity={0.7}
          >
            <View style={styles.radioButton}>
              {selectedGender === "FEMALE" && <View style={styles.radioButtonInner} />}
            </View>
            <TextComponent
              text="Nữ"
              size={16}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
              styles={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.valueRow}>
          <TextComponent
            text={value}
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={styles.value}
          />
        </View>
      )}
    </View>
  );
};

interface DateRowProps {
  label: string;
  value: string;
  isEditing: boolean;
  onPress?: () => void;
}

const DateRow = ({ label, value, isEditing, onPress }: DateRowProps) => {
  return (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      activeOpacity={isEditing ? 0.7 : 1}
      disabled={!isEditing}
    >
      <View style={styles.labelRow}>
        <TextComponent
          text={label}
          size={14}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
        />
      </View>
      <View style={styles.valueRow}>
        <View style={styles.valueContainer}>
          <TextComponent
            text={value}
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={styles.value}
          />
        </View>
        {isEditing && (
          <View style={styles.editIcon}>
            <Feather name="calendar" size={16} color={appColor.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <View style={{ width: "100%" }}>
    <TextComponent
      text={required ? `${label}*` : label}
      size={14}
      color={appColor.gray2}
      font={fontFamilies.roboto_regular}
      styles={{ marginBottom: 8 }}
    />
    {children}
  </View>
);

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
    justifyContent: "center",
    marginTop: 20,
    position: "relative",
    width: "100%",
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
  cameraBadge: {
    position: "absolute",
    bottom: 1,
    right: "50%",
    marginRight: -47,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFA500",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: appColor.white,
  },
  infoSection: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "column",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: appColor.gray,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    textAlign: "left",
  },
  valueContainer: {
    flex: 1,
    marginRight: 8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  editIcon: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexShrink: 0,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColor.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: appColor.primary,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: appColor.text,
    fontFamily: fontFamilies.roboto_regular,
    padding: 0,
    margin: 0,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  datePickerModal: {
    backgroundColor: appColor.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColor.gray,
  },
  closeButton: {
    padding: 4,
  },
  datePickerContent: {
    padding: 16,
    height: 250,
  },
  wheelPickerContainer: {
    flexDirection: "row",
    height: 200,
    justifyContent: "space-around",
  },
  wheelColumn: {
    flex: 1,
    position: "relative",
    marginHorizontal: 8,
  },
  wheelScrollContent: {
    paddingVertical: 80,
  },
  wheelItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  wheelSelector: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColor.primary,
    borderStyle: "dashed",
  },
  datePickerFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: appColor.gray,
    justifyContent: "center",
    alignItems: "center",
  },
});

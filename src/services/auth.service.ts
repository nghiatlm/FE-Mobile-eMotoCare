import AsyncStorage from "@react-native-async-storage/async-storage";
import authenticationAPI from "../apis/authApi";
import { addAuth } from "../redux/reducers/authReducer";
import store from "../redux/store";
import { Validate } from "../utils/validate";

export const login = async (values: any, isRemember: boolean) => {
  const { phone, password } = values;
  const errors: Record<string, string> = {};

  if (!phone) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!Validate.Phone(phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (!Validate.Password(password)) {
    errors.password = "Mật khẩu không hợp lệ";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const res = await authenticationAPI.HandleAuthentication(
      "/login",
      values,
      "post"
    );
    if (res.data.success) {
      store.dispatch(addAuth(res.data.data));
      await AsyncStorage.setItem(
        "auth",
        isRemember ? JSON.stringify(res.data.data) : phone
      );
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message };
    }
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: "Đăng nhập thất bại. Vui lòng thử lại." };
  }
};

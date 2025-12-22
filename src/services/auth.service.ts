import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, registerApi, verify } from "../apis/auth.api";
import { addAuth } from "../redux/reducers/authReducer";
import store from "../redux/store";
import { Validate } from "../utils/validate";

export const register = async (model: any) => {
  const { phone, password } = model;
  const errors: Record<string, string> = {};
  if (!phone) {
    errors.phone = "Số điện thoại không được để trống";
  } else if (!Validate.Phone(phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }
  if (!password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (!Validate.Password(password)) {
    errors.password = "Mật khẩu phải có ít nhất 5 ký tự";
  }
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
  try {
    const res = await registerApi(model);
    if (res.success) {
      console.log("Register successful:", res.data);
      return { success: true, data: res.data };
    }
    return { success: false, message: res.message || "Đăng ký thất bại" };
  } catch (error: any) {
    return { success: false, message: error.message || "Đăng ký thất bại" };
  }
};

export const login = async (model: any, isRemember: boolean) => {
  const { phone, password } = model;
  const errors: Record<string, string> = {};
  if (!phone) {
    errors.phone = "Số điện thoại không được để trống";
  } else if (!Validate.Phone(phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }
  if (!password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (!Validate.Password(password)) {
    errors.password = "Mật khẩu phải có ít nhất 5 ký tự";
  }
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
  try {
    const res = await loginApi(model);
    console.log("Login service response:", res);
    if (res.success) {
      // normalize payload: some APIs return { data: { data: ... } } while others return { data: ... }
      const payload = res?.data?.data ?? res?.data;
      if (!payload) {
        console.log("Login succeeded but payload is undefined:", res);
        return { success: false, message: "Dữ liệu đăng nhập không hợp lệ" };
      }
      console.log("Login successful:", payload);
      store.dispatch(addAuth(payload));
      try {
        if (isRemember) {
          await AsyncStorage.setItem("auth", JSON.stringify(payload));
        } else if (phone) {
          await AsyncStorage.setItem("auth", phone);
        } else {
          // if phone is not provided, ensure we don't pass undefined to AsyncStorage
          await AsyncStorage.removeItem("auth");
        }
      } catch (storageError) {
        console.log("AsyncStorage setItem error:", storageError);
      }
      return { success: true, data: payload };
    }
    return { success: false, message: res.message || "Đăng nhập thất bại" };
  } catch (error: any) {
    // Ưu tiên lấy message từ response để tránh hiển thị mã lỗi mặc định
    console.log("Login error:", error);
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message;
    const apiErrors = error?.response?.data?.errors;
    if (apiErrors) {
      return {
        success: false,
        errors: apiErrors,
        message: apiMessage || "Đăng nhập thất bại. Vui lòng thử lại.",
      };
    }
    return {
      success: false,
      message: apiMessage || "Đăng nhập thất bại. Vui lòng thử lại.",
    };
  }
};

export const verifycation = async (model: any) => {
  try {
    const res = await verify(model);
    if (res.success) {
      return { success: true, data: res.data };
    }
    return { success: false, message: res.message || "Xác thực thất bại" };
  } catch (error: any) {
    return { success: false, message: error.message || "Xác thực thất bại" };
  }
};

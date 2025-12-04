import { registerApi } from "../apis/auth.api";
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
    console.log("Register service response:", res);
    if (res.success) {
      console.log("Register successful:", res.data);
      return { success: true, data: res.data };
    }
    return { success: false, message: res.message || "Đăng ký thất bại" };
  } catch (error: any) {
    console.log("Register error:", error);
    return { success: false, message: error.message || "Đăng ký thất bại" };
  }
};

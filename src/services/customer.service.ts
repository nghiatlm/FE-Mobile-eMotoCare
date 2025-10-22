import customerAPI from "../apis/customer.api";

export const getCustomerByAccount = async (id: string) => {
  try {
    const res = await customerAPI.HandleCustomer("/customers", id, "post");
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: "Đăng nhập thất bại. Vui lòng thử lại." };
  }
};

import { appInfor } from "../constants/appInfor";
import axiosClient from "./axiosClient";

class AuthAPI {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method?: "get" | "post" | "put" | "delete",
    base?: string
  ) => {
    return await axiosClient(`${appInfor.BASE_URL}/auths${url}`, {
      method: method || "get",
      data,
    });
  };
}

const authenticationAPI = new AuthAPI();
export default authenticationAPI;

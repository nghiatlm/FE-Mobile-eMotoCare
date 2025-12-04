import queryString from "query-string";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  paramsSerializer: (params) => queryString.stringify(params),
  setTimeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const instance = axios.create(config);

const getTokenFromStorage = async (): Promise<string | null> => {
  try {
    const raw = await AsyncStorage.getItem("auth");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.token)
        return parsed.token;
      if (typeof parsed === "string") return parsed;
      return null;
    } catch {
      // raw is plain string (phone or token)
      return raw;
    }
  } catch (e) {
    return null;
  }
};

instance.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await getTokenFromStorage();
      config.headers = {
        ...(config.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
      };
    } catch (e) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: "",
        Accept: "application/json",
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    // log chi tiết để debug (status, data, message)
    console.log("Error response:", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    console.log("Error response:", JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
);

export default instance;

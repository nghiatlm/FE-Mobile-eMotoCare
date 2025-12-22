import * as Location from "expo-location";

export type LocationCoords = {
  latitude: number;
  longitude: number;
};

export type LocationResult = {
  coords: LocationCoords | null;
  error?: string;
};

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

export const getCurrentLocation = async (): Promise<LocationResult> => {
  try {
    const granted = await requestLocationPermission();
    if (!granted) {
      return { coords: null, error: "Không được cấp quyền vị trí" };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch (error: any) {
    return { coords: null, error: error?.message || "Lỗi lấy vị trí" };
  }
};

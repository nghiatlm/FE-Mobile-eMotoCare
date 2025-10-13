import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelecter } from "../redux/reducers/authReducer";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { SplashScreen } from "../screens";

const AppRouter = () => {
  const [isShowSlpash, setIsShowSplash] = useState(true);

  const { getItem } = useAsyncStorage("auth");

  const auth = useSelector(authSelecter);
  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin();
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const checkLogin = async () => {
    const res = await getItem();
    console.log(res);

    res && dispatch(addAuth(JSON.parse(res)));
  };

  return (
    <>
      {isShowSlpash ? (
        <SplashScreen />
      ) : auth.token ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppRouter;

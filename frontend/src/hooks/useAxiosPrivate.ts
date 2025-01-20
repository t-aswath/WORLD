import { useEffect } from "react";
import useRefresh from "./useRefresh";
import { CanceledError } from "axios";
import { axiosPrivate } from "@/utils/axios";
import { useAuthContext } from "@/utils/store";
import { useCookies } from "react-cookie";


const useAxiosPrivate = () => {
  const refresh = useRefresh();
  const { auth, setAuth } = useAuthContext((state) => state);
  const [ cookies ] = useCookies(['access_token']);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config) => {
      if (!config.headers["authorization"]) {
        config.headers["authorization"] = `Bearer ${cookies.access_token}`;
      }
      return config;
    }, (err) => Promise.reject(err));

    const responseIntrecept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err: CanceledError<any>) => {
        const prevReq = err?.config;
        if (err.response?.status === 403) {
          const { access_token } = await refresh();
          if (prevReq) {
            prevReq.headers["authorization"] = `Bearer ${access_token}`;
            return axiosPrivate(prevReq);
          }
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntrecept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;


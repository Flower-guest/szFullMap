import Request from "./request";
import localCache from "@/utils/Cache";

const timeOut = 30000;
const xjRequest = new Request({
  baseURL: import.meta.env.VITE_BASE_URL + "",
  timeout: timeOut,
  interceptors: {
    requestInterceptor: (config) => {
      const token = localCache.getCache("access_token") ?? "";
      if (token) {
        config.headers = {
          "access-token": token,
          // Authorization: `bearer ${token}`,
        };
      }
      return config;
    },
  },
});

const request = new Request({
  baseURL: import.meta.env.VITE_BASE_LAUNCH_URL + "",
  timeout: timeOut,
});

export default xjRequest;

export { request };

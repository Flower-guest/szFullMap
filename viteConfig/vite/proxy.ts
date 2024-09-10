import { API_BASE_URL, API_TARGET_URL,
  API_BASE_LAUNCH__URL ,
API_TARGET_LAUNCH_URL,API_BASE_JGQXW_URL ,
API_TARGET_JGQXW_URL } from "../constant";
import { ProxyOptions } from "vite";

type ProxyTargetList = Record<string, ProxyOptions>;

const init: ProxyTargetList = {
  [API_BASE_URL]: {
    target: API_TARGET_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_URL}`), ""),
  },
  [API_BASE_LAUNCH__URL]: {
    target: API_TARGET_LAUNCH_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_LAUNCH__URL}`), ""),
  },
  [API_BASE_JGQXW_URL]: {
    target: API_TARGET_JGQXW_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_JGQXW_URL}`), ""),
  },
};

export default init;

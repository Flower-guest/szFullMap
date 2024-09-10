import axios from "axios";
import type { AxiosInstance } from "axios";
import { XJRequestInterceptors, RequestConfig } from "./type";
import { showLoadingToast, showFailToast, closeToast } from "vant";

const DEFAULT_LOADING = true; //loading默认状态

class Request {
  instance: AxiosInstance;
  interceptors?: XJRequestInterceptors;
  showLoading: boolean;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.showLoading = config.showLoading ?? DEFAULT_LOADING;
    this.interceptors = config.interceptors;

    // 实例独有的请求响应拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    // 全局请求响应拦截
    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading)
          showLoadingToast({
            message: "加载中...",
            forbidClick: true,
            loadingType: "spinner",
          });
        return config;
      },
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        closeToast();
        const data = res.data;
        if (data?.code == 200 || data?.code == 1) {
          return data.data || data;
        } else {
          showFailToast(data.msg);
        }
      },
      (err) => {
        closeToast();
        showFailToast(err?.response?.data || "网络超时");
        return err;
      }
    );
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 请求独有的请求拦截
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      // 独有的请求加载
      this.showLoading = config.showLoading ?? DEFAULT_LOADING;

      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 独有的响应拦截
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T>(config: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "GET" });
  }

  post<T>(config: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "POST" });
  }
}

export default Request;

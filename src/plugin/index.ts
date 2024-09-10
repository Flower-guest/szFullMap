import localCache from "@/utils/Cache";
import { showFailToast } from "vant";
import { request } from "@/service";
import { getRuralInfo } from "@/service/map";
const getToken = async () => {
  const { appid }: { appid: string } = useUrlSearchParams("hash"); //vueUse API
  const result: any = await request.get({
    url: `/getAccessToken?appid=${appid}`,
  });
  if (result?.code == 1) {
    localCache.setCache("appid", appid);
    localCache.setCache("access_token", result.access_token);
  } else {
    showFailToast(result?.message ?? result?.msg);
  }
  // 保存村庄信息
  const ruralInfo = await getRuralInfo();
  localCache.setCache("ruralInfo", ruralInfo);
};

export default getToken;

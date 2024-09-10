import router from "@/router";
import localCache from "@/utils/Cache";
import getToken from "@/plugin";

router.beforeEach(async (to, _from, next) => {
  console.log(_from);
  const res = localCache.getCache("access_token") || null;
  const appidCache = localCache.getCache("appid") || null;
  const { appid }: { appid: string } = useUrlSearchParams("hash");
  // 判断该用户是否登录
  if (res && appidCache == appid) {
    next();
  } else {
    // 如果登陆了并且不是前往首页有无appid都不影响
    if (res && to.path !== "/index") {
      next();
    } else {
      // 否则没token并且路径为首页 appid也为空  就删除token appid 重新去请求
      localCache.deleteCache("access_token");
      localCache.deleteCache("appid");
      await getToken();
      next();
    }
  }
});

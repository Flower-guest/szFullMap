import router from "@/router";
import { showConfirmDialog } from "vant";

const TMap = (window as any).TMap;

// 静态图片应用公共函数
export function getAssets(url: string) {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
}

// 服务器图片应用公共函数
export function getSeverImg(url: string) {
  return url ? import.meta.env.VITE_BASE_LAUNCH_URL + url : "";
}

// 平滑过渡到指定状态，mapStatus为key-value格式，可以设定center、zoom、rotation、pitch。
export function easeTo(map, zoom, center, duration = null) {
  map.easeTo(
    {
      zoom: parseInt(zoom ?? 13),
      center: new TMap.LatLng(center[0], center[1]),
    },
    { duration: duration ?? 2000 }
  );
}

// 根据指定的地理范围调整地图视野。
export function fitBounds(map, linePath) {
  const minLat = Math.min(
    ...linePath.map((location) => parseFloat(location.lat))
  );
  const maxLat = Math.max(
    ...linePath.map((location) => parseFloat(location.lat))
  );
  const minLng = Math.min(
    ...linePath.map((location) => parseFloat(location.lng))
  );
  const maxLng = Math.max(
    ...linePath.map((location) => parseFloat(location.lng))
  );
  const ne = new TMap.LatLng(maxLat, maxLng); //东北角坐标
  const sw = new TMap.LatLng(minLat, minLng); //西南角坐标
  const latLngBounds = new TMap.LatLngBounds(sw, ne);
  map.fitBounds(latLngBounds, {
    padding: { top: 20, bottom: 120, left: 50, right: 50 },
  });
}

// marker点击事件
export function markerClick(mapPlugins, ck) {
  const marker = mapPlugins.marker;
  marker.marker.on("click", function (evt) {
    ck(evt);
  });
}

// 打电话公共函数
export function callPhone(mobile: string) {
  showConfirmDialog({
    message: mobile || "暂无号码",
    confirmButtonText: "拨号",
  })
    .then(() => {
      window.location.href = "tel://" + mobile;
    })
    .catch(() => {});
}

//手绘图显隐函数
export function toggleHandDrawn(value: boolean) {
  window.imageGroundLayer.setVisible(value);
}

// 跳转页面公共函数
export function toPage(path: string, query = "", isBtoa = false) {
  if (query) {
    if (isBtoa) query = window.btoa(window.encodeURIComponent(query));
    router.push(`/${path}/${query}`);
  } else {
    router.push(`/${path}`);
  }
}

// 返回上一个页面
export function backPage() {
  router.back();
}

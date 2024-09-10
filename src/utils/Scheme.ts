import { showLoadingToast, closeToast } from "vant";
class Scheme {
  andriodBaidu: string | undefined; //安卓百度地图唤起地址
  iOSBaidu: string | undefined; //IOS百度地图唤起地址
  andriodGaode: string | undefined; //安卓高德地图唤起地址
  iOSGaode: string | undefined; //IOS高德地图唤起地址
  andriodTenXun: string | undefined; //安卓腾讯地图唤起地址
  iOSTenXun: string | undefined; //IOS腾讯地图唤起地址
  iOSApple: string | undefined; //Apple地图唤起地址
  downloadBaidu: string | undefined; //百度地图下载地址
  downloadIOSBaidu: string | undefined; //IOS百度地图下载地址
  downloadGaode: string | undefined; //安卓高德地图下载地址
  downloadIOSGaode: string | undefined; //IOS高德地图下载地址
  downloadTenXun: string | undefined; //安卓腾讯地图下载地址
  downloadIOSTenXun: string | undefined; //IOS腾讯地图下载地址;
  mapType: string;
  isAndroid: boolean;

  constructor(to, mapType) {
    const u = navigator.userAgent;
    this.isAndroid =
      u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 ? true : false; //android终端
    this.mapType = mapType;
    this.setMapScheme(to);
  }

  setMapScheme(to: any) {
    this.andriodBaidu = `bdapp://map/direction?destination=name:${to.name}|latlng:${to.latitude},${to.longitude}&coord_type=gcj02&mode=driving&src=andr.jianghu.jianhao`;

    this.iOSBaidu = `baidumap://map/direction?destination=name:${to.name}|latlng:${to.latitude},${to.longitude}&coord_type=gcj02&mode=driving&src=ios.jianghu.jianhao`;

    this.andriodGaode = `amapuri://route/plan/?sourceApplication=mhc&dlat=${to.latitude}&dlon=${to.longitude}&dname=${to.name}&dev=0&t=0`;

    this.iOSGaode = `iosamap://path?sourceApplication=mhc&dlat=${to.latitude}&dlon=${to.longitude}&dname=${to.name}&dev=0&t=0`;

    this.andriodTenXun = `qqmap://map/routeplan?type=drive&from=我的位置&tocoord=${to.latitude},${to.longitude}&to=${to.name}&referer=SY2BZ-3K4RN-WODFX-SZJJW-4JC62-WMBJQ`;

    this.iOSTenXun = `qqmap://map/routeplan?type=drive&from=我的位置&tocoord=${to.latitude},${to.longitude}&to=${to.name}&referer=SY2BZ-3K4RN-WODFX-SZJJW-4JC62-WMBJQ`;

    this.iOSApple = `http://maps.apple.com/?ll=${to.latitude},${to.longitude}&q=${to.name}`;

    this.downloadBaidu = `https://map.baidu.com/zt/qudao/newfengchao/1012337a/html/slide.html?src=pinzhuan`;

    this.downloadIOSBaidu = `https://apps.apple.com/cn/app/id452186370`;

    this.downloadGaode = `https://wap.amap.com/`;

    this.downloadIOSGaode = `https://apps.apple.com/cn/app/id461703208`;

    this.downloadTenXun = ` https://pr.map.qq.com/j/tmap/download`;

    this.downloadIOSTenXun = `https://apps.apple.com/cn/app/id481623196`;
  }

  getMapScheme() {
    showLoadingToast({
      message: "加载中...",
      forbidClick: true,
      loadingType: "spinner",
    });
    const openMap = this.isAndroid
      ? this[`andriod${this.mapType}`]
      : this[`iOS${this.mapType}`];
    window.location.href = openMap;
    setTimeout(() => {
      closeToast();
      window.location.href = this.isAndroid
        ? this[`download${this.mapType}`]
        : this[`downloadIOS${this.mapType}`];
    }, 2000);
  }
}

export default Scheme;

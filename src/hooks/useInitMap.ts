/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-09-26 11:13:52
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-05-29 15:52:49
 * @FilePath: \szFullMap-wzb\src\hooks\useInitMap.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const TMap = (window as any).TMap;
const useInitMap = (info) => {
  window.document.title = info.name;
  const map = new TMap.Map("container", {
    zoom: info?.mapZoom ?? 17,
    center: new TMap.LatLng(
      JSON.parse(info.mapCenter)[0],
      JSON.parse(info.mapCenter)[1]
    ),
    renderOptions: {
      enableBloom: true, // 折线是否启用泛光效果 注：为true才会有效果
    },
    baseMap: {
      type: "vector",
      features: ["base", "point", "label", "arrow"],
    },
    viewMode: "2D",
  });

  const imgUrl = import.meta.env.VITE_BASE_LAUNCH_URL + info.layerUrl;
  const imageSW = new TMap.LatLng(
    JSON.parse(info.imageSW)[0],
    JSON.parse(info.imageSW)[1]
  );
  const imageNE = new TMap.LatLng(
    JSON.parse(info.imageNE)[0],
    JSON.parse(info.imageNE)[1]
  );
  const imageLatLngBounds = new TMap.LatLngBounds(imageSW, imageNE);
  const imageGroundLayer = new TMap.ImageGroundLayer({
    bounds: imageLatLngBounds,
    src: imgUrl,
    map: map,
  });
  window.imageGroundLayer = imageGroundLayer;

  // const layerId = imageGroundLayer.getId(); // 获取图层ID

  // 根据输入 LAYER_LEVEL 常量调整 layerId 对应图层的渲染层级 ，其中layerId可以通过图层getId方法获取。TMap.constants.LAYER_LEVEL 代表图层级别常量，见帮助文档（https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap）
  // map.moveLayer(layerId, TMap.constants.LAYER_LEVEL.TEXT);

  // 设置腾讯地图控件位置
  setPosition(map);

  return {
    map,
  };
};

// 设置腾讯地图控件位置
const setPosition = (map) => {
  map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM); //移除缩放控件
  map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION); //移除指南针
};

export default useInitMap;

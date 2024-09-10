const TMap = (window as any).TMap;

class Marker {
  marker: any;
  map: any;
  geometries: any;

  constructor(map: any, markers: any) {
    this.map = map;
    this.geometries = [];
    this.initMarkerData(markers);
  }
  //初始化marker
  initMarkerData(markers) {
    this.marker = new TMap.MultiMarker({
      id: markers?.markerLayerId ?? "marker-layer",
      map: this.map,
    });
    // 判断是否配置了默认markers
    if (markers && markers?.markerLayerId !== "marker-line") {
      for (const i in markers) {
        this.update(markers[i]);
      }
    }
    this.geometries = this.marker.geometries;
  }
  // 修改marker
  update(val) {
    const styleId = val.name || val.id;
    // 修改marker样式
    if (!this.marker.styles.hasOwnProperty(styleId)) {
      this.setStyle(val, styleId);
    }
    // 修改定位跟marker名
    this.marker.updateGeometries([
      {
        ...val,
        position: new TMap.LatLng(val.latitude, val.longitude),
        properties: { title: val.name },
        styleId,
        content: val?.needName == "false" ? "" : val.name, //是否需展示marker名字
      },
    ]);
  }
  setStyle(val, styleId) {
    const defaultStyles = this.marker.styles.default;
    const comStyle = {
      anchor: { x: 17, y: 23 },
      size: 16, // 标注点文本文字大小
      direction: "top", // 标注点文本文字相对于标注点图片的方位
      offset: { x: 0, y: 0 }, // 标注点文本文字基于direction方位的偏移属性
      strokeColor: "#015E66", // 标注点文本描边颜色
      strokeWidth: 12, // 标注点文本描边宽度
      ...val,
    };
    const style = new TMap.MarkerStyle({
      src: val?.icon ?? defaultStyles.src,
      // src: defaultStyles.src,
      width: 42,
      height: 48,
      color: "#fff",
      ...comStyle,
    });
    this.marker.styles[styleId] = style;
  }
  // 删除marker
  remove(id) {
    if (id) {
      this.marker.remove([id]);
      this.geometries = this.marker.geometries;
    }
  }
  reset() {
    this.marker && this.marker.setMap(null);
    this.marker = null;
    this.geometries = [];
  }
}

export default Marker;

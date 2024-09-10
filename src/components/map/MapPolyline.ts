const TMap = (window as any).TMap;

class Polyline {
  polyline: any;
  map: any;
  geometries: any;
  editor: any; //编辑模式
  defaultPolyline: any; //默认polyline.geometries

  constructor(map: any, polylines: any) {
    this.map = map;
    this.geometries = [];
    this.initPolylineData(polylines);
  }
  //初始化polyline
  initPolylineData(polylines) {
    this.polyline = new TMap.MultiPolyline({
      id: "polyline-layer",
      map: this.map,
    });
    // 判断是否配置了默认polylines
    if (polylines) {
      for (const i in polylines) {
        this.update(polylines[i]);
      }
    }
    this.geometries = this.polyline.geometries;
  }
  // 修改polyline
  update(val) {
    const defaultStyles = this.polyline.styles.default;
    // 修改polyline样式
    this.setStyle(val, defaultStyles);
    // 修改定位跟polyline名
    this.polyline.updateGeometries([
      {
        ...val,
        styleId: val.id,
        paths: this.pathsFormat(val.paths),
        position: val.paths[0],
      },
    ]);
  }
  // 修改样式
  setStyle(val, defaultStyles) {
    const arrowOptions = {
      width: parseInt(val.arrowW) || 6,
      height: parseInt(val.arrowH) || 4,
      space: parseInt(val.arrowS) || 50,
    };
    const style = new TMap.PolylineStyle({
      color: val.color || defaultStyles.color, //线填充色
      width: parseInt(val.width) || defaultStyles.width, //折线宽度
      borderColor: val.borderColor || defaultStyles.borderColor, //边线颜色
      borderWidth: parseInt(val.borderWidth) || defaultStyles.borderWidth, //边线宽度
      lineCap: val.lineCap || defaultStyles.lineCap, //线端头方式，可选为butt，round，square，默认为butt。
      dashArray: [val.dashArray, val.dashArray] || defaultStyles.dashArray, //虚线展示方式，[0, 0]为实线，[10, 10]表示十个像素的实线和十个像素的空白（如此反复）组成的虚线，默认为[0, 0];
      showArrow: val.showArrow || defaultStyles.showArrow, //	是否沿线路方向显示箭头，默认为false
      arrowOptions: arrowOptions || defaultStyles.arrowInfo, //箭头显示配置，仅在showArrow为true时有效。数据格式[6,0,50,0]
      enableBloom: val.enableBloom || defaultStyles.enableBloom, //	是否对折线启用泛光效果
    });
    this.polyline.styles[val.id] = style;
  }
  // 删除polyline
  remove(id) {
    if (id) {
      this.polyline.remove([id]);
      this.geometries = this.polyline.geometries;
    }
  }
  // 将更新传过来的paths转成LatLng对象
  pathsFormat(paths) {
    const newPaths: any = [];
    paths.forEach((e: any) => {
      newPaths.push(new TMap.LatLng(e.lat, e.lng));
    });
    return newPaths;
  }
  reset() {
    this.polyline && this.polyline.setMap(null);
    this.polyline = null;
    this.geometries = [];
  }
}

export default Polyline;

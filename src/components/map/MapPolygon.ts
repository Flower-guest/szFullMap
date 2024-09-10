const TMap = (window as any).TMap;

class Polygon {
  polygon: any;
  map: any;
  geometries: any;
  editor: any; //编辑模式
  defaultPolygon: any; //默认polygon.geometries

  constructor(map: any, polygons: any) {
    this.map = map;
    this.geometries = [];
    if (polygons) this.initPolygonData(polygons);
  }
  //初始化polygon
  initPolygonData(polygons) {
    this.polygon = new TMap.MultiPolygon({
      id: "polygon-layer",
      map: this.map,
    });
    // 判断是否配置了默认polygons
    if (polygons) {
      for (const i in polygons) {
        this.update(polygons[i]);
      }
    }
  }
  // 修改polygon
  update(val) {
    const defaultStyles = this.polygon.styles.default;
    // 修改polygon样式
    this.setStyle(val, defaultStyles);
    // 修改polygon
    this.polygon.updateGeometries([
      {
        ...val,
        paths: this.pathsFormat(val.paths),
        position: val.paths[0],
      },
    ]);
    return this.polygon.geometries;
  }
  // 修改样式
  setStyle(val, defaultStyles) {
    const showBorder = val.showBorder == 1 ? true : false;
    const borderDashArray = val.borderDashArray
      ? [parseInt(val.borderDashArray), parseInt(val.borderDashArray)]
      : "";
    const style = new TMap.PolygonStyle({
      color: val.color || defaultStyles.color, //面填充色
      showBorder: showBorder || defaultStyles.borderColor, //是否显示边线，默认为false
      borderColor: val.borderColor || defaultStyles.borderColor, //边线颜色
      borderWidth: parseInt(val.borderWidth) || defaultStyles.borderWidth, //边线宽度
      borderDashArray: borderDashArray || defaultStyles.borderDashArray, //边线虚线虚线展示方式，[0, 0]为实线，[10, 10]表示十个像素的实线和十个像素的空白（如此反复）组成的虚线;
    });
    this.polygon.styles[val.styleId] = style;
  }
  // 将更新传过来的paths转成LatLng对象
  pathsFormat(paths) {
    const newPaths: any = [];
    paths.forEach((e: any) => {
      newPaths.push(new TMap.LatLng(e.lat, e.lng));
    });
    return newPaths;
  }
}

export default Polygon;

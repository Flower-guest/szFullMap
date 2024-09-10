const TMap = (window as any).TMap;

class Label {
  label: any;
  map: any;
  editor: any;
  geometries: any;
  defaultLabel: any; //默认label.geometries
  position: any; //地图中心点

  constructor(map: any, label: any) {
    this.label = null;
    this.map = map;
    this.geometries = [];
    if (label) this.initLabel(label);
  }
  //初始化label
  initLabel(label) {
    this.label = new TMap.MultiLabel({
      id: "label-layer",
      map: this.map,
    });
    // 判断是否配置了默认label
    if (label) {
      for (const i in label) {
        this.update(label[i]);
      }
    } else {
      this.update(this.defaultLabel);
    }
    this.geometries = this.label.geometries;
  }
  // 修改Label
  update(val) {
    const defaultStyles = this.label.styles.default;
    // 修改label样式
    this.setStyle(val, defaultStyles);
    // 修改定位跟label名
    this.label.updateGeometries([
      {
        ...val,
        position: new TMap.LatLng(val.latitude, val.longitude),
        content: val.name,
        rank: parseInt(val.rank),
      },
    ]);
    return this.label.geometries;
  }
  // 设置样式
  setStyle(val, defaultStyles) {
    const style = new TMap.LabelStyle({
      color: val.color || defaultStyles.color,
      size: parseInt(val.size) || defaultStyles.size,
      offset: {
        x: parseInt(val.offset_x) || defaultStyles.offset.x,
        y: parseInt(val.offset_y) || defaultStyles.offset.y,
      },
    });
    this.label.styles[val.styleId] = style;
  }
}

export default Label;

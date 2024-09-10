import ClusterBubble from "./ClusterBubble";
const TMap = (window as any).TMap;

class MarkerCluster {
  markerCluster: any;
  map: any;
  geometries: any;
  clusterBubbleList: any;
  markerGeometries: any;
  marker: any;

  constructor(map: any, markers: any) {
    this.map = map;
    this.marker = markers;
    this.geometries = [];
    this.clusterBubbleList = [];
    this.markerGeometries = [];
    this.initMarkerData(markers.geometries);
  }
  //初始化marker
  initMarkerData(markers) {
    for (const i in markers) {
      this.geometries.push({
        ...markers[i],
        position: new TMap.LatLng(
          markers[i].position.lat,
          markers[i].position.lng
        ),
      });
    }
    this.markerCluster = new TMap.MarkerCluster({
      id: "markerCluster-layer",
      map: this.map,
      geometries: this.geometries,
      enableDefaultStyle: false, // 启用默认样式
      minimumClusterSize: 3, // 形成聚合簇的最小个数
      zoomOnClick: true, // 点击簇时放大至簇内点分离
      gridSize: 90, // 聚合算法的可聚合距离
      averageCenter: false, // 每个聚和簇的中心是否应该是聚类中所有标记的平均值
    });

    this.markerCluster.on("cluster_changed", () => {
      // 销毁旧聚合簇生成的覆盖物
      if (this.clusterBubbleList.length) {
        this.clusterBubbleList.forEach(function (item) {
          item.destroy();
        });
        this.clusterBubbleList = [];
      }
      this.markerGeometries = [];

      // 根据新的聚合簇数组生成新的覆盖物和点标记图层
      const clusters = this.markerCluster.getClusters();
      clusters.forEach((item) => {
        if (item.geometries.length > 2) {
          const clusterBubble = new ClusterBubble({
            map: this.map,
            position: item.center,
            content: item.geometries.length,
          });
          clusterBubble.on("click", () => {
            this.map.fitBounds(item.bounds);
          });
          clusterBubble.on("touchend", () => {
            this.map.fitBounds(item.bounds);
          });
          this.clusterBubbleList.push(clusterBubble);
        } else {
          this.markerGeometries.push({
            ...item.geometries[0],
            styleId: item.geometries[0].name,
          });
        }
      });
      // 已创建过点标记图层，直接更新数据
      this.marker.marker.setGeometries(this.markerGeometries);
    });
  }
  reset() {
    this.markerCluster && this.markerCluster.setMap(null);
    this.markerCluster = null;
    // 因为是自定义遮盖物，所以需要循环清除
    this.clusterBubbleList.forEach((overlay) => {
      overlay.setMap(null);
    });
    this.clusterBubbleList = [];
    this.geometries = [];
    this.marker = null;
    this.markerGeometries = [];
  }
}

export default MarkerCluster;

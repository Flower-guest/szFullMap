// import DOMOverlay from "./MapDOMOverlay";
import Marker from "./MapMarker";
import MarkerCluster from "./MapCluster";
// import Label from "./MapLabel";
// import Polyline from "./MapPolyline";
// import Polygon from "./MapPolygon";

const mapPlugins: any = {};

export function createMapPlugins(map, mapDataInit) {
  // const overlay = new DOMOverlay(map, mapDataInit?.doms ?? "");
  // const marker = new Marker(map, mapDataInit?.markers ?? "");
  // const markerCluster = new MarkerCluster(map, marker.marker ?? "");
  // const label = new Label(map, mapDataInit?.labels ?? "");

  // if (!mapPlugins["polyline"]) {
  //   const polyline = new Polyline(map, mapDataInit?.polylines ?? "");
  //   mapPlugins["polyline"] = polyline;
  // }
  // const polygon = new Polygon(map, mapDataInit?.polygons ?? "");
  // mapPlugins["DOMOverlay"] = overlay;
  const marker = new Marker(map, mapDataInit ?? "");
  const markerCluster = new MarkerCluster(map, marker ?? "");
  mapPlugins["marker"] = marker;
  mapPlugins["markerCluster"] = markerCluster;
  // mapPlugins["label"] = label;
  // mapPlugins["polygon"] = polygon;
  return mapPlugins;
}

export const setMap = (mapPlugins) => {
  mapPlugins["marker"].reset();
  mapPlugins["markerCluster"].reset();
  // mapPlugins["polyline"].reset();
  // mapPlugins["polygon"].reset();
  // mapPlugins["label"].reset();
  // mapPlugins["DOMOverlay"].reset();
};

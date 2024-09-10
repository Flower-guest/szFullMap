import xjRequest from "..";
import { IDataType } from "./types";


// 获取地图坐标分类
export const requestMapSort = () => {
  return xjRequest.get<IDataType>({
    url: `?IDIP=181`,
  });
};
// 获取分类坐标 category:分类id
export const getMapSortMarkerData = (id) => {
  return xjRequest.get({
    url: `?IDIP=${182}&category=${id}`,
  });
};
// 获取单个坐标点的信息
export const getMarkerInfo = (id) => {
  return xjRequest.get({
    url: `?IDIP=${185}&id=${id}`,
  });
};
// 获取村庄数据
export const getRuralInfo = () => {
  return xjRequest.get({
    url: `?IDIP=${183}`,
  });
};
// 获取旅游路线列表
export const getTouristRoute = () => {
  return xjRequest.get({
    url: `?IDIP=${186}`,
  });
};
// 主要领导
export const getLeader = () => {
  return xjRequest.get({
    url: `?IDIP=${184}&key=74`,
  });
};


<template>
  <div class="w-screen h-screen overflow-hidden">
    <div v-show="show">
      <!-- 顶部搜索功能 -->
      <Search
        @search="search"
        @focus="showResult = true"
        @clear="showResult = false"
      />
      <!-- 分类筛选功能 -->
      <Classification
        ref="topRef"
        class="classification"
        :marker-type="markerType"
        @type-click="typeClick"
      />
      <!-- 左下角功能导航栏 -->

      <ToolBar
        ref="refToolBar"
        @line-road="detailDialog"
        @show-footer="handleNavbarPopup"
      />
    </div>
    <!-- 地图 -->
    <div class="w-screen h-screen" id="container"></div>
    <!--  marker详情信息 -->
    <DetailInfo
      :detailInfo="detailInfo"
      :show-info="showInfo"
      @update:show-info="changeDetail"
    />
    <!-- 底部搜索 -->
    <FloatFooter
      v-show="showFooter"
      :marker-data="markerData"
      @to-detail="detailDialog"
    />
    <!-- 搜索页面 -->
    <div class="search-result" v-show="showResult">
      <template v-if="searchList.length > 0">
        <div
          @click="detailDialog(i)"
          v-for="i in searchList"
          :key="i.id"
          class="mb-10px"
        >
          <div class="text-30px text-#029AA7 mb-24px">景区</div>
          <div class="line"></div>
          <div class="px-16px pt-32px">
            <div class="flex justify-between">
              <div
                class="font-extrabold text-30px text-#353535 flex items-center"
              >
                <img
                  class="w-60px h-68px mr-21px"
                  :src="getAssets('cluster-bubble.png')"
                />{{ i.name }}
              </div>
              <div
                class="text-20px text-#888 flex flex-col justify-center items-center"
              >
                <img
                  class="w-48px h-48px mb-8px"
                  :src="getAssets('icon-dzq.png')"
                />到这去
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- 定位icon -->
    <img
      @click="location"
      v-show="!show"
      class="location"
      :src="getAssets('position.png')"
    />
  </div>
</template>

<script setup lang="ts">
import Classification from "./com/classification.vue";
import ToolBar from "./com/toolBar.vue";
import DetailInfo from "./com/detailInfo.vue";
import FloatFooter from "./com/floatFooter.vue";
import useInitMap from "@/hooks/useInitMap";
import { getAssets, markerClick, easeTo } from "@/utils";
import localCache from "@/utils/Cache";
import { requestMapSort, getMapSortMarkerData } from "@/service/map";
import { createMapPlugins, setMap } from "@/components/map/index";

const topRef = ref<any>();
const refToolBar = ref<any>();
const showInfo = ref<boolean>(false); //popup是否展示
const showFooter = ref<boolean>(true); // 是否展示底部
const show = ref<boolean>(true);
const showResult = ref<boolean>(false); // 是否展示搜索结果
const searchList = ref<any>([]); // 搜索结果列表
const detailInfo = ref<any>(null); // 详情信息
const markerData = ref<any>(); // Marker 数据
const markerType = ref<any>([{ name: "全部", id: 0 }]); //分类
let map, mapPlugins, ruralInfo;

// 初始化Map，获取地图数据并添加相应事件
const initMap = async () => {
  ruralInfo = localCache.getCache("ruralInfo");
  markerData.value = await getAllMarker(); //获取分类与点位信息
  ({ map } = useInitMap(ruralInfo));
  window.map = map;
  // 初始化
  window.mapPlugins = mapPlugins = createMapPlugins(map, markerData.value);
  // 地图点击事件
  map.on("click", () => {
    // 如果show为true时隐藏页面所有东西 否则显示
    showFooter.value = !show.value;
    show.value = !show.value;
    refToolBar.value.showPopup = false;
  });
  // 添加marker点击事件
  markerClick(mapPlugins, (e) => detailDialog(e));
};

/**
 * 搜索框搜索事件，根据输入的值进行搜索
 * @param {string} val - 搜索关键词
 */
const search = useDebounceFn(async (val) => {
  searchList.value = val ? markerData.value : [];
}, 500);

/**
 * 处理分类点击事件
 * @param {Object} category - 选中的分类
 */
const typeClick = async (category) => {
  markerData.value =
    category.id == "0"
      ? await getAllMarker()
      : await showMarker([{ ...category }]);
  resetMap();
};

// marker详情弹窗打开
const detailDialog = (evt) => {
  showInfo.value = true;
  showFooter.value = false;
  showResult.value = false;
  detailInfo.value = evt?.geometry ?? evt;
  easeTo(map, ruralInfo?.markerZoom, [
    detailInfo.value?.position?.lat ?? detailInfo.value.latitude,
    detailInfo.value?.position?.lng ?? detailInfo.value.longitude,
  ]); //平滑缩放,旋转到指定级别
};

// 定位到初始地图位置
const location = () => {
  easeTo(map, ruralInfo?.mapZoom, [
    JSON.parse(ruralInfo.mapCenter)[0],
    JSON.parse(ruralInfo.mapCenter)[1],
  ]); //平滑缩放,旋转到指定级别
};

/**
 * 当 Navbar 弹窗打开或关闭时，控制 FloatFooter 组件的显示和隐藏
 * @param {boolean} isOpen - Navbar 弹窗是否打开
 * @param {string} type - Navbar tool点击的类型
 */
const handleNavbarPopup = (isOpen, type) => {
  if (show.value) showFooter.value = !isOpen;
  if (!isOpen && type == "tjlx") {
    mapPlugins = createMapPlugins(map, markerData.value);
    markerClick(mapPlugins, (e) => detailDialog(e));
  }
};

//重置地图状态和插件  val:地图加载marker初始化值
const resetMap = () => {
  setMap(mapPlugins);
  mapPlugins = createMapPlugins(map, markerData.value);
  markerClick(mapPlugins, (e) => detailDialog(e));
};

/**
 * 获取所有 Marker 数据
 * @returns {Array} - 所有 Marker 数据
 */
const getAllMarker = async () => {
  markerType.value = [{ name: "全部", id: 0 }];
  const resSort: any = await requestMapSort();
  // 添加分类
  resSort.filter((i) => {
    markerType.value.push({ id: i.id, name: i.name, icon: i.icon });
  });
  const res = await showMarker(markerType.value);
  return res;
};

/**
 * 根据分类过滤 Marker 数据
 * @param {Array} selectedCategories - 选中的分类列表
 * @returns {Array} - 过滤后的 Marker 数据
 */
const showMarker = async (billArr) => {
  const list: any = [];
  for (const i in billArr) {
    list.push(getMapSortMarkerData(billArr[i].id));
  }
  const res = await Promise.all([...list]);
  // 将父级的icon路径赋值给子集
  billArr.forEach((i, idx) => {
    res[idx].filter((j) => {
      j["icon"] = i?.icon ?? null;
    });
  });
  return res.flat();
};

// 详情弹窗显隐状态修改
const changeDetail = (val: boolean) => {
  showInfo.value = val;
  showFooter.value = false;
  show.value = false;
};

onMounted(() => {
  initMap();
});
</script>

<style lang="less">
.classification {
  z-index: 1004;
  position: absolute;
}
.location {
  z-index: 1003;
  position: absolute;
  bottom: 29%;
  right: 20px;
  width: 80px;
  height: 80px;
}

.clusterBubble {
  cursor: pointer;
  border-radius: 50%;
  color: #029aa7;
  font-weight: 500;
  text-align: center;
  opacity: 1;
  background: url("../../assets/img/cluster-bubble.png") no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0px;
  left: 0px;
}

.scale {
  margin-bottom: 20%;
}
// 顶部搜索
.search {
  border-radius: 16px;
  .van-field__left-icon {
    display: flex;
    align-items: center;
  }
}
// tabs标签页
.tabs {
  .van-tab--active {
    font-size: 32px;
  }
  .van-tabs__line {
    background-color: #029aa7;
  }
}
// 搜索结果页面
.search-result {
  position: absolute;
  background-color: #fff;
  width: 100%;
  top: 108px;
  left: 0;
  height: calc(100% - 108px);
  z-index: 10000;
  padding: 10px 35px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
}
</style>

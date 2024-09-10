<template>
  <!-- 手绘图开关 -->
  <div class="sht">
    <van-switch
      v-model="showSHT"
      @click="toggleHandDrawn(showSHT)"
      active-color="#029AA7"
      inactive-color="#B2B2B2"
    />
    <span class="mt-4px">手绘地图</span>
  </div>
  <!-- 全景按钮 -->
  <van-image
    class="panorama"
    @click="toPage('webView', ruralInfo.vrUrl, true)"
    :src="getAssets('icon_vr.png')"
    lazy-load
  />
  <div class="tool-bar">
    <div class="tools" v-show="showTool">
      <span
        @click="toolClick(i)"
        class="text-32px text-#fff"
        :class="{ 'mb-41px': idx < toolList.length - 1 }"
        v-for="(i, idx) in toolList"
        :key="i.label"
        >{{ i.label }}</span
      >
    </div>
    <van-image
      @click="showTool = !showTool"
      class="w-80px h-80px"
      :src="getAssets('icon-tool.png')"
      lazy-load
    />
    <Popups
      v-if="popupConfig.type !== 'fxym'"
      :height="popupConfig.height"
      :title="popupConfig.title"
      :lock="false"
      :overlay="false"
      v-model:show-popup="showPopup"
    >
      <!-- 推荐路线 -->
      <template v-if="popupConfig.type == 'tjlx'">
        <div class="tjlx">
          <div
            class="px-33px"
            :class="{ 'lx-active': popupActive.lx == i.id }"
            @click="lineClick(i)"
            v-for="(i, idx) in popupListDom"
            :key="i.id"
          >
            <div class="flex items-center py-36px">
              <img class="w-84px h-84px mr-16px" :src="getSeverImg(i.images)" />
              <div class="flex flex-col flex-1 overflow-hidden">
                <span class="text-#353535 text-30px">{{ i.name }}</span>
                <span class="w-100% text-#888 text-26px mt-px ellipsis">
                  {{ i.content }}
                </span>
              </div>
            </div>
            <div v-if="idx < popupListDom.length - 1" class="line"></div>
          </div>
        </div>
      </template>
      <!-- 图层风格 -->
      <template v-else>
        <div class="flex justify-between mt-32px px-36px">
          <div
            v-for="i in popupListDom"
            :key="i.label"
            @click="styleClick(i)"
            :class="{ tcfg: popupActive.fg === i.val }"
            class="popup-text"
          >
            <img class="w-196px h-108px" :src="getAssets(i.img)" />
            <span class="mt-21px">{{ i.label }}</span>
          </div>
        </div>
      </template>
    </Popups>
  </div>
  <Share v-model:show-share="showShare" />
</template>

<script setup lang="ts">
import { setMap } from "@/components/map/index";
import Marker from "@/components/map/MapMarker";
import Polyline from "@/components/map/MapPolyline";
import { getTouristRoute } from "@/service/map";
import {
  getAssets,
  getSeverImg,
  toPage,
  markerClick,
  fitBounds,
  toggleHandDrawn,
} from "@/utils";
import localCache from "@/utils/Cache";
import { showLoadingToast, closeToast } from "vant";

const showTool = ref<boolean>(false); //是否显示功能单
const popupConfig = reactive<any>({ height: 0, title: "", type: "" }); //底部弹出层配置
const popupListDom = ref<any>(); //弹出层渲染dom内容
const showPopup = ref<boolean>(false); //是否显示弹出层
const showSHT = ref<boolean>(true); //是否显示手绘图
const popupActive = reactive<any>({ fg: "vector", lx: null }); //弹出层内容点击的内容
const showShare = ref<boolean>(false); //是否显示分享页面
const toolList = ref<any>([
  {
    label: "推荐线路",
    val: "tjlx",
    list: [],
  },
  {
    label: "图层风格",
    val: "tcfg",
    list: [
      {
        img: "img-pm.png",
        label: "平面地图",
        val: "vector",
      },
      {
        img: "img-wx.png",
        label: "卫星地图",
        val: "satellite",
      },
      {
        img: "img-qj.png",
        label: "全景地图",
        val: "vr",
        vrUrl: "",
      },
    ],
  },
  {
    label: "乡村简介",
    val: "xcjj",
  },
  {
    label: "分享页面",
    val: "fxym",
  },
]);
let ruralInfo = localCache.getCache("ruralInfo");

const init = async () => {
  const resLine: any = await getTouristRoute();
  toolList.value[0].list = resLine; //将旅游路线赋值
  toolList.value[1].list[2].vrUrl = ruralInfo.vrUrl; //全景地址赋值
};

const toolClick = (i) => {
  showTool.value = false;
  if (i.val == "fxym") {
    showShare.value = true;
  } else if (i.val == "xcjj") {
    toPage("ruralInfo");
  } else {
    showPopup.value = true;
    popupConfig.type = i.val;
    popupConfig.title = i.label;
    popupListDom.value = i.list;
    switch (i.val) {
      case "tjlx":
        popupConfig.height = "200px";
        break;
      default:
        popupConfig.height = "168px";
    }
  }
};

// 图层风格点击事件
const styleClick = (i) => {
  popupActive.fg = i.val;
  if (i.val == "vr") {
    toPage("webView", i.vrUrl, true);
  } else {
    window.map.setBaseMap({ type: i.val });
  }
};

const emit = defineEmits(["showFooter", "lineRoad"]);
let oldLineInfo: any,
  mapPlugin: any = {};
// 推荐路线
const lineClick = async (i) => {
  setMap(window.mapPlugins);
  // 判断是否有对象 没有就生成对应类
  if (Object.keys(mapPlugin).length === 0) {
    mapPlugin["marker"] = new Marker(window.map, {
      markerLayerId: "marker-line",
    });
    mapPlugin["polyline"] = new Polyline(window.map, "");
  }
  showLoadingToast({
    message: "加载中...",
    forbidClick: true,
    loadingType: "spinner",
  });
  // 如果有上次点跟线数据就删除
  if (oldLineInfo) await removePreviousLineAndMarkers(oldLineInfo, mapPlugin);
  oldLineInfo = i.spot;
  // 点击列表是否相同 相同的话取消高亮与删除元素不同反之
  popupActive.lx = popupActive.lx === i.id ? null : i.id;
  if (popupActive.lx) await generateLineAndMarkers(i, mapPlugin);
  // 给添加的marker添加点击事件
  markerClick(mapPlugin, (e) => emit("lineRoad", e));
  closeToast();
};
// 删除上次生成的线和点位
const removePreviousLineAndMarkers = async (oldLineInfo, mapPlugin) => {
  for (const lineInfo of oldLineInfo) {
    await mapPlugin.marker.remove(lineInfo.id);
  }
  await mapPlugin.polyline.remove("line");
};
// 生成点和线
const generateLineAndMarkers = async (i: any, mapPlugin: any) => {
  const linePath: any[] = [];
  for (const j of i.spot) {
    await mapPlugin.marker.update({
      ...j,
      needName: "false",
      icon: getSeverImg(j.icon),
      latitude: j.latitude,
      longitude: j.longitude,
    });
    linePath.push({ lat: j.latitude, lng: j.longitude });
  }
  // 创建线
  await mapPlugin.polyline.update({
    ...i,
    paths: linePath,
    id: "line",
    color: "#45a9f4",
    dashArray: 10,
    width: 5,
  });
  // 根据指定的地理范围调整地图视野。
  fitBounds(window.map, linePath);
};

// 当功能菜单点击是否显示底部滑动菜单
watch([showPopup, showShare], (val) => {
  const is = val[0] || val[1] ? true : false;
  // 如果有线路没删除时，将线路删除且取消选中状态
  if (!val[0] && oldLineInfo) {
    removePreviousLineAndMarkers(oldLineInfo, mapPlugin);
    popupActive.lx = null;
  }
  emit("showFooter", is, popupConfig.type);
});

onMounted(async () => {
  await init();
});

defineExpose({ showPopup });
</script>

<style lang="less" scoped>
@media only screen and (max-height: 701px) {
  /* 在高度小于或等于700像素时应用的样式 */
  .sht {
    top: calc(45% - 140px) !important;
  }
  .panorama {
    top: calc(45% - 140px) !important;
  }
}
@media only screen and (min-height: 701px) and (max-height: 780px) {
  .sht {
    top: calc(41% - 138px) !important;
  }
  .panorama {
    top: calc(41% - 138px) !important;
  }
}
.sht {
  z-index: 1003;
  position: absolute;
  top: calc(28% - 140px);
  left: 20px;
  background-color: #fff;
  padding: 17px 12px 13px;
  color: #888;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}
.panorama {
  z-index: 1003;
  position: absolute;
  top: calc(28% - 140px);
  right: 20px;
  width: 88px;
  height: 88px;
}
.tool-bar {
  z-index: 1003;
  position: absolute;
  bottom: 29%;
  left: 20px;
  .tools {
    background: url("../../../assets/img/tool-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    padding: 21px 36px;
    margin-bottom: 28px;
  }
  .tjlx {
    height: calc(100% - 100px);
    overflow: hidden;
    overflow-y: auto;
    .lx-active {
      background: #e6fdff !important;
    }
  }
  .tcfg {
    color: #03c8d9 !important;

    img {
      border: 3px solid #03c8d9;
      border-radius: 10px;
    }
  }
  .tcxy {
    color: #03c8d9 !important;
    .xy-box-active {
      border: 2px solid #03c8d9 !important;
    }
  }
  .popup-text {
    color: #353535;
    font-size: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .xy-box {
      width: 108px;
      height: 108px;
      background: #f2f7f7;
      border: 2px solid #dddddd;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: #ddd;
  }
  .ellipsis {
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
}
</style>
